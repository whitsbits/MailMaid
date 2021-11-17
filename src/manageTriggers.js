/**
 * Get the current triggers for reporting to user
 */

function getTriggersArr () {
  const triggers = ScriptApp.getProjectTriggers();
  let triggerArr = [];
  for (var i=0; i<triggers.length; i++){
    triggerArr.push (triggers[i].getHandlerFunction())
  }
  Logger.log (`${user} - getTriggerArr returning ${triggerArr}`)
  return triggerArr
}

/**
 * Checks is a named trigger is active
 * @param {triggerName}
 * @return {boolean}
 */
function triggerActive(triggerName) {
  let triggerArr = getTriggersArr()
  let triggerBool = triggerArr.includes(triggerName)
  Logger.log (`${user} - triggerActive returning ${triggerName} as ${triggerBool}`)
  return triggerBool
}

/**
 * Find and remove and triggers that have been duplicated
 */
function removeDupeTriggers() {
  var strArray = getTriggersArr();
  let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
  let dupes = (findDuplicates(strArray)).toString() // All duplicates
  //console.log([...new Set(findDuplicates(strArray))]) // Unique duplicates
  if (dupes != ""){
    Logger.log (`${user} - Found duplicate trigger ${dupes}, removing duplicate`)
    removeTriggers(dupes);
    initSchedule(); //re-initialize the scheduled trigger if main trigger was dupe
  }else{
    Logger.log (`${user} - No dupes found`)
  }
}

/**
 * Create a trigger that executes the main function to run nightly
 */
 function setTrigger(triggerName, atHour, everyDays) {
  var userTimeZone = Session.getScriptTimeZone();
  Logger.log (`${user} - Local Timezone is ${userTimeZone}`)
  ScriptApp.newTrigger(triggerName)
    .timeBased()
    .atHour(atHour)
    .everyDays(everyDays) // Frequency is required if you are using atHour() or nearMinute()
    .inTimezone(userTimeZone)
    .create();
}


/**
 * Create a time based trigger that executes a function one hour from now
 * used for managing API timeouts
 * @param {triggerName}
 */
 function setMoreTrigger(triggerName) {
    ScriptApp.newTrigger(triggerName)
      .timeBased()
      .at(new Date(new Date().getTime() + 1000 * 60 * 60))
      .create();
  }

  /**
 * Deletes named trigger
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
  Logger.log(`${user} - Trigger ${triggerName} removed`);
}

