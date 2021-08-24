/**
 * Create a trigger that executes the main function to run nightly
 */
 function setTrigger() {
  ScriptApp.newTrigger('GMailRetention')
    .timeBased()
    .atHour(1)
    .everyDays(1) // Frequency is required if you are using atHour() or nearMinute()
    .create();
}


/**
 * Create a trigger that executes the purgeMore function two minutes from now
 */
 function setPurgeMoreTrigger() {
    ScriptApp.newTrigger('purgeMore')
      .timeBased()
      .at(new Date(new Date().getTime() + 1000 * 60 * 2))
      .create();
  }