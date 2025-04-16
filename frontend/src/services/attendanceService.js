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
    const response = await api.get('/attendance/reports/export', {
      params: { type, ...params },
      responseType: 'blob'
    });
    return response.data;
  }
};
