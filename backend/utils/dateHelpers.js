/**
 * Get the start of day (00:00:00) for a given date
 * @param {Date} date - Input date
 * @returns {Date} Date set to start of day
 */
exports.getStartOfDay = (date) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  };
  
  /**
   * Get the end of day (23:59:59) for a given date
   * @param {Date} date - Input date
   * @returns {Date} Date set to end of day
   */
  exports.getEndOfDay = (date) => {
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  };
  
  /**
   * Get the start date of the week containing the given date
   * Weeks start on Monday
   * @param {Date} date - Input date
   * @returns {Date} Date set to start of week
   */
  exports.getStartOfWeek = (date) => {
    const startDate = new Date(date);
    const day = startDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startDate.setDate(diff);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  };
  
  /**
   * Get the end date of the week containing the given date
   * Weeks end on Sunday
   * @param {Date} date - Input date
   * @returns {Date} Date set to end of week
   */
  exports.getEndOfWeek = (date) => {
    const endDate = new Date(date);
    const day = endDate.getDay();
    const diff = endDate.getDate() + (day === 0 ? 0 : 7 - day); // Adjust when day is Sunday
    endDate.setDate(diff);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  };
  
  /**
   * Get the start date of the month containing the given date
   * @param {Date} date - Input date
   * @returns {Date} Date set to start of month
   */
  exports.getStartOfMonth = (date) => {
    const startDate = new Date(date);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  };
  
  /**
   * Get the end date of the month containing the given date
   * @param {Date} date - Input date
   * @returns {Date} Date set to end of month
   */
  exports.getEndOfMonth = (date) => {
    const endDate = new Date(date);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  };
  
  /**
   * Format date to YYYY-MM-DD
   * @param {Date} date - Input date
   * @returns {string} Formatted date string
   */
  exports.formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  /**
   * Get the number of working days (Mon-Fri) between two dates
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {number} Number of working days
   */
  exports.getWorkingDaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Not Saturday or Sunday
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return count;
  };