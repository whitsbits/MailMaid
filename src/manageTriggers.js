/**
 * Get the currnet triggers for reporting to user
 */

function getTriggers () {
  const triggers = ScriptApp.getProjectTriggers();
  Logger.log (triggers);
}


/**
 * Create a trigger that executes the main function to run nightly
 */
 function setTrigger(atHour, everyDays) {
  ScriptApp.newTrigger('GMailRetention')
    .timeBased()
    .atHour(atHour)
    .everyDays(everyDays) // Frequency is required if you are using atHour() or nearMinute()
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

  /**
 * Deletes all triggers
 * @param {triggerName}
 */
 function removeTriggers(triggerName) {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    if (trigger.getHandlerFunction() === triggerName) {
      ScriptApp.deleteTrigger(trigger);
    }
  }
  Logger.log(`Trigger ${triggerName} removed`);
}

