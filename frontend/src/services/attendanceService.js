import api from './api';

export const attendanceService = {
  markAttendance: async (attendanceData) => {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  },

  getAttendance: async (filters = {}) => {
    const response = await api.get('/attendance', { params: filters });
    return response.data;
  },

  getAttendanceById: async (id) => {
    const response = await api.get(`/attendance/${id}`);
    return response.data;
  },

  updateAttendance: async (id, attendanceData) => {
    const response = await api.put(`/attendance/${id}`, attendanceData);
    return response.data;
  },

  deleteAttendance: async (id) => {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
  },

  getDailyReport: async (date) => {
    const response = await api.get('/attendance/reports/daily', {
      params: { date }
    });
    return response.data;
  },

  getWeeklyReport: async (date) => {
    const response = await api.get('/attendance/reports/weekly', {
      params: { date }
    });
    return response.data;
  },

  getMonthlyReport: async (month, year) => {
    const response = await api.get('/attendance/reports/monthly', {
      params: { month, year }
    });
    return response.data;
  },

  exportReport: async (type, params) => {
    try {
      const response = await api.get('/attendance/reports/export', {
        params: { type, ...params },
        responseType: 'blob' // Important: ensures you receive a file
      });

      const blob = new Blob(
        [response.data],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Construct filename
      const dateLabel = params.date || params.month || 'report';
      link.setAttribute('download', `AttendanceReport_${dateLabel}.xlsx`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export report:", error);
      throw error;
    }
  }
};
