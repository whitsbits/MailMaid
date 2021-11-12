/**
 * Way to set time-out for any loops to avoid API call time limits
 */
 function isTimeUp_(start, timer) {
    // Breaktimer to not allow script to run over time allotment
    const now = new Date();
    return now.getTime() - start.getTime() > timer; 
  }