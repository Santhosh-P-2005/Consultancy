const ExcelJS = require('exceljs');
const { formatDate } = require('./dateHelpers');

/**
 * Generate Excel report for attendance data
 * @param {Array} data - Attendance data
 * @param {string} reportType - Type of report (daily, weekly, monthly, custom)
 * @returns {Buffer} Excel file buffer
 */
exports.generateExcelReport = async (data, reportType) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance Report');
  
  // Define common columns
  const columns = [
    { header: 'Staff ID', key: 'staffId', width: 15 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Department', key: 'department', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Notes', key: 'notes', width: 30 }
  ];
  
  worksheet.columns = columns;
  
  // Apply header styling
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' }
  };
  
  // Add data
  data.forEach(record => {
    worksheet.addRow({
      staffId: record.staffId,
      name: record.staff?.name || 'Unknown',
      department: record.staff?.department || 'Unknown',
      date: formatDate(record.date),
      status: record.status.charAt(0).toUpperCase() + record.status.slice(1),
      notes: record.notes || ''
    });
  });
  
  // Format status column with colors
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip header row
      const statusCell = row.getCell('status');
      
      if (statusCell.value === 'Present') {
        statusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF90EE90' } // Light green
        };
      } else if (statusCell.value === 'Absent') {
        statusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF9999' } // Light red
        };
      } else if (statusCell.value === 'Leave') {
        statusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFCC99' } // Light orange
        };
      } else if (statusCell.value === 'Halfday') {
        statusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFF599' } // Light yellow
        };
      }
    }
  });
  
  // Add summary information at the top of the report
  let reportTitle = 'Attendance Report';
  switch (reportType) {
    case 'daily':
      reportTitle = `Daily Attendance Report - ${formatDate(new Date(data[0]?.date || new Date()))}`;
      break;
    case 'weekly':
      const firstDate = new Date(Math.min(...data.map(r => new Date(r.date))));
      const lastDate = new Date(Math.max(...data.map(r => new Date(r.date))));
      reportTitle = `Weekly Attendance Report - ${formatDate(firstDate)} to ${formatDate(lastDate)}`;
      break;
    case 'monthly':
      const date = new Date(data[0]?.date || new Date());
      reportTitle = `Monthly Attendance Report - ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      break;
    case 'custom':
      const customFirstDate = new Date(Math.min(...data.map(r => new Date(r.date))));
      const customLastDate = new Date(Math.max(...data.map(r => new Date(r.date))));
      reportTitle = `Custom Attendance Report - ${formatDate(customFirstDate)} to ${formatDate(customLastDate)}`;
      break;
  }
  
  // Add title
  worksheet.spliceRows(1, 0, [reportTitle]);
  worksheet.mergeCells('A1:F1');
  worksheet.getCell('A1').font = { bold: true, size: 16 };
  worksheet.getCell('A1').alignment = { horizontal: 'center' };
  
  // Add summary stats
  const present = data.filter(r => r.status === 'present').length;
  const absent = data.filter(r => r.status === 'absent').length;
  const leave = data.filter(r => r.status === 'leave').length;
  const halfday = data.filter(r => r.status === 'halfday').length;
  const total = data.length;
  
  worksheet.spliceRows(2, 0, 
    ['Summary:'],
    [`Total Records: ${total}`, `Present: ${present}`, `Absent: ${absent}`, `Leave: ${leave}`, `Half Day: ${halfday}`],
    [''] // Empty row for spacing
  );
  
  worksheet.mergeCells('A2:F2');
  worksheet.getCell('A2').font = { bold: true };
  
  worksheet.mergeCells('A3:F3');
  worksheet.getCell('A3').alignment = { horizontal: 'left' };
  
  // Adjust the column widths based on content
  worksheet.columns.forEach(column => {
    column.width = Math.max(column.width || 10, 12);
  });
  
  // Generate and return the Excel file buffer
  return await workbook.xlsx.writeBuffer();
};