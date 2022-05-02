/**
 * Helper fucntions to help run scrips.
 */

/**
 * Sets the environmental variable to baseline before running the main process
 */

function MailMaid() {
  try {
    clearAllCache();
    removeTriggers('cleanMore');
    cleanMail();
  }
  catch (e) {
    Logger.log(`${user} - ${e.toString()} from MailMaid`);
  }
}

/**
 * Wrapper for the purge function called by timeOut trigger
 */
function cleanMore() {
  try {
    removeTriggers('cleanMore');
    cleanMail();
  }
  catch (e) {
    Logger.log(`${user} - ${e.toString()} from cleanMore`);
  }
}


/**
* Wrapper for the purge function called by timeOut trigger
*/
function countMoreSenders() {
  try {
    removeTriggers('countMoreSenders');
    countSenders();
  }
  catch (e) {
    Logger.log(`${user} - ${e.toString()} from countMore`);
  }
};

/**
 * Responds to trigger to chcek if MailMaid trigger has been disabled
 * 
 */
function checkTrigger() {
  if (checkLastRun()) {
    initSchedule();
  };
};

/**
 * Check that the schedule is working
 */

function checkLastRun() {
  let schedule = getScheduleArr();
  if (schedule === null) {
    initSchedule();
    schedule = getScheduleArr();
  }
  let days = parseInt((schedule[0]), 10);
  Logger.log(`${user} - Has schedule MailMaid every ${days}`)
  var maxTime = Math.round(+days * 86400000)
  var lastRunEpoch = parseInt(userProperties.getProperty('lastRunEpoch'), 10);
  var elapsedTime = (Date.now() - lastRunEpoch);
  if (elapsedTime > maxTime) {
    Logger.log(`${user} - Schedule is failing`)
    return true
  }
  Logger.log(`${user} - Schedule is working`)
  return false
}

function checkAuth() {
  let checkAuthCount = userProperties.getProperty('authCount')
  if (checkAuthCount > 5) {
    if (licenseRead()==='false') {
      removeTriggers('MailMaid'); //kill the job from running
      removeTriggers('checkTrigger');
      sendReportEmail("MailMaid has been disabled", "src/basic-email.html", false, licenseRead(), null,
        ["MailMaid has been disabled from running",
          "If you wish to use the application again, click on the icon and approve the application to run"])
          Logger.log(`${user} - Triggers turned off for TRIAL user`);
    } else {
      MailApp.sendEmail("support@mailmaid.co",
        "MailMaid user failing authorization check",
        "Please contact for support");
        Logger.log(`${user} - checkAuth support email sent for PAID user`);
    }
    return false;
  };
  const authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
  if (authInfo.getAuthorizationStatus() == ScriptApp.AuthorizationStatus.REQUIRED) {
    Logger.log(`${user} - Missing required scope authorizations`)
    sendReportEmail("MailMaid Needs your attention, please", "src/basic-email.html", false, licenseRead(), null,
      ["For MailMaid to continue to work, you need to launch the app from the right sidebar in your Gmail application and click AUTHORIZE ACCESS",
        "If you no longer wish to use the application in Trial mode, click the three dots in the upper right, select Manage add-on and then three dots again to Uninstall"])
    ++checkAuthCount;
    userProperties.setProperty('authCount', checkAuthCount)
    return false
  } else {
    Logger.log(`${user} - Required scope authorizations present`);
    return true
  };
}


/**
* Function to clear all rules data from the userProperties
* @return {notify with Card to be built}
*/
function clearAllRules() {
  var numRules = objectLength(userProperties.getProperties());
  for (var i = 1; i < numRules + 1; i++) {
    userProperties.deleteProperty(`rule${i}`);
  };
  Logger.log(`${user} - Deleted ${i - 1} rules.`);
  return notify(`Rules Cleared`, onHomepage());
};

/**
* Utility function to clear all rules data from the userProperties
* without offering a return
*/

function clearRules() {
  var numRules = objectLength(userProperties.getProperties());
  for (var i = 1; i < numRules + 1; i++) {
    userProperties.deleteProperty(`rule${i}`);
  };
  Logger.log(`${user} - Deleted ${i - 1} rules.`);
};

/**
* Function to clear a user selected rules data from the userProperties
* @param {Object} e - Event from add-on server
* @return {notify with Card to be built}
*/
function clearSelectedRule(e) {
  let ruleNum = e.parameters.ruleNum.toString()
  if (ruleNum === 'ruleX') {
    return notify('Please select a rule from the list above', rulesManagerCard())
  } else {
    userProperties.deleteProperty(ruleNum);
    reIndexRules();
    Logger.log(`${user} - Deleted ${ruleNum}`);
    return notify(`Rule ${ruleNum} cleared`, rulesManagerCard());
  }
};

/**
* Function to Clear the schedule data from the userProperties
* @returns Notification and rebuiild of schedule card
*/
function clearSchedule() {
  userProperties.deleteProperty('schedule');
  removeTriggers('MailMaid');
  return notify(`Schedule Cleared`, scheduleCard());
};

/**
* Function to initialize the schedule data to the userProperties
*/
function initSchedule() {
  let schedule = userProperties.getProperty('schedule');
  if (schedule === null) {
    var atHour = 1
    var everyDays = 1
  } else {
    let schedule = getScheduleArr();
    var atHour = schedule[1]
    var everyDays = schedule[0]
  };
  userProperties.setProperties({ 'schedule': JSON.stringify([atHour, everyDays]) });
  removeTriggers('MailMaid');
  setTrigger('MailMaid', atHour, everyDays);
  Logger.log(`${user} - Schedule Initialized`);
};

/**
* Function to initialize the rules
* ruleX for the UI pick list
* defaultRule for the install smaple rule
*/
function initRules() {
  cache.putString('editRuleNum', 'ruleX');
  let defaultRule = userProperties.getProperty('rule0');
  if (defaultRule === null) {
    defaultRule = ['Purge', 'subject:(MailMaid Results)', 3, 0]
    userProperties.setProperties({ 'rule0': JSON.stringify(defaultRule) });
  };
};

/**
* Function to check initialization status of the app
* @return {boolean}
*/
function checkInitStatus() {
  if (userProperties.getProperty('initialized') === null ||
    userProperties.getProperty('initialized') === false) {
    return false;
  } else {
    return true;
  }
}

/**
 * Returns userProperties in the PropertyService
 * sorts the objects and converts the object to an array 
 *  * @return {rules} an array with [rule atributes]
 */
function getRulesArr() {
  var keys = getRuleKeys();
  var rulesArr = [];
  if (keys.length === 0) {
    rulesArr = `You do not currently have any rules set`;
    Logger.log(`${user} - Returning getRulesArr ${rulesArr}`)
    return rulesArr
  }
  i, len = keys.length;

  for (var i = 0; i < len; i++) {
    k = keys[i];
    ruleValue = userProperties.getProperty(k)
      .replace(/[\[\]"]/g, '')
      .split(',');
    rulesArr.push(ruleValue)
  }
  rulesArr.sort(function (a, b) {
    return a[3] - b[3]
  });
  Logger.log(`${user} - Returning getRulesArr ${rulesArr}`)
  return rulesArr;
};

/**
 * Returns userProperties in the PropertyService
 * sorts the objects and converts the object to an array 
 *  * @return {schedule} an array with [numDays, onHour]
 */
function getScheduleArr() {
  var data = userProperties.getProperty(`schedule`);
  if (data === null) {
    return data;
  }
  var schedule = data
    .replace(/[\[\]"]/g, '')
    .split(',');
  Logger.log(`${user} - Returning scheduleArr ${schedule}`)
  return schedule;
};

/**
 * Determines where the prior run of scripts stopped and
 * restarts script based on prior state of cached values
 *  * @return {countStart} the index number for where to start the process
 */
function getCountStart() {
  let threadsCached = cache.getNumber('threadLoopCache');
  if (threadsCached === null) {
    countStart = 0;
    Logger.log(`${user} - Starting Inbox count from 0`)
  } else {
    countStart = threadsCached;
    Logger.log(`${user} - Using cached threads of: ${threadsCached}`)
  };
  return countStart
}

/**
 * Determines the length of an object
 * sorts the objects and converts the object to an array 
 *  * @return {length} an integer for the length of the object
 */
function objectLength(object) {
  var length = 0;
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      ++length;
    }
  }
  Logger.log(`${user} - Returning objectLength ${length}`)
  return length;
};


/**
 * Gets the Keys from rules in the userProperty store
 *  * @return {ruleKeys} an array of key names
 */
function getRuleKeys() {
  var keys = userProperties.getKeys();
  var ruleKeys = keys.filter(function (item) {
    return (item.includes("rule"))
  });
  Logger.log(`${user} - getRuleKeys returned ${ruleKeys}`)
  return ruleKeys;
}

/**
 * Counts the number of rules in the userProperty store=
 *  * @return {numRules} an integer of the number of rules
 */
function countRules() {
  ruleCount = getRuleKeys().length
  Logger.log(`${user} - countRules returned ${ruleCount}`)
  return ruleCount
}

/**
 * Returns userProperties in the PropertyService 
 * as text for reporting in UI
 *  * @return {text} a text blob of current userProperties rules
 */

function reportRulesText() {
  var rules = getRulesArr();
  var text = "";
  if (typeof rules === "string") {
    text = rules
    return text;
  }
  for (let i = 0; i < rules.length; i++) {
    var action = rules[i][0];
    var search = rules[i][1];
    var days = rules[i][2];
    var index = rules[i][3];
    text += ("<b>Rule " + index + ":</b>\n   Action to take: <b><font color=\"#ff3355\">" + action + "</font></b>\n   Search string: <font color=\"#3366cc\">" + search + "</font>\n   Take action after\: <font color=\"#3366cc\">" + days + " days </font>\n\n")
  };
  Logger.log(`${user} - Returning reportRulesText: \n ${text}`)
  return text
};

/**
* Builds an array of all the rules in the userProperties
* for the purpose of building the selectRules UI 
*  * @return {reportRulesArr} an array of all rules in the userProperties
*/
function reportRulesArr() {
  var rules = getRulesArr();
  var reportRulesArr = [];
  if ((rules === null || rules.length === 0)) {
    return `You do not currently have any rules set`;
  }
  for (let i = 0; i < rules.length; i++) {
    var action = rules[i][0];
    var search = rules[i][1];
    var days = rules[i][2];
    var index = rules[i][3];
    reportRulesArr.push("<b>Rule </b>" + index + ":\n   Action to take: " + action + "\n   Search string: " + search + "\n   Take action after\: " + days + " days \n\n")
  }
  Logger.log(`${user} - Returning reportRulesArr: \n ${reportRulesArr}`)
  return reportRulesArr
};

/**
* Returns the element attributes of the named rule
*  * @param {ruleNum} the string for the rule number (rule1)
*  * @return {ruleElements} an array with [action][search][days]
*/
function reportRulesArrElements(ruleNum) {
  const rule = userProperties.getProperty(ruleNum);
  Logger.log(`${user} - Fetching reportRulesArrElements for ${ruleNum}: \n ${rule}`)
  let ruleElemArray = [];
  ruleElemArray = rule
    .replace(/[\[\]"]/g, '')
    .split(',');
  Logger.log(`${user} - Returning reportRulesArrElements for ${ruleNum}: \n ${rule}`)
  return ruleElemArray
};

/**
* Returns the element attributes of the schedule
*  * @return {scheduleText} an text block for presenting schedule in UI
*/
function reportSchedule() {
  var schedule = getScheduleArr();
  var text = ''
  if (schedule == null) {
    text = `You do not currently have any schedule set`;
    return text
  }
  var everyDays = schedule[0];
  var militaryTime = schedule[1];

  text = `MailMaid is currently schedule to work: \n   <b>Every:</b> ${everyDays} day(s) \n   <b>At Hour:</b> ${militaryTime}:00h \n\n`
  Logger.log(`${user} - Returning reportSchedule Text: \n ${text}`)
  return text
};

/**
* Takes the array of rules and renumbers them in sequential order
* for after a rule is deleted
* saves new index to userProperties.setProperty
*/
function reIndexRules() {
  var rules = getRulesArr();
  var keys = getRuleKeys();

  keys.sort();
  clearRules();

  for (i = 1; i < keys.length; i++) {
    var newKey = `rule${i}`;
    rules[i].splice(3, 1); //remove the prior index from the array
    rules[i].push(i); // add the new index to the array
    userProperties.setProperty(newKey, JSON.stringify(rules[i]));
    Logger.log(`${user} - Reindexed ${keys[i]} with value ${rules[i]} to ${newKey}.`)
  }
  Logger.log(`${user} - Rules property store reindexed`)
};

/**
 * Checks that timestamp is valid and returns it
 * @param {*} _timestamp 
 * @returns {newTimestamp}
 */
function isValidTimestamp(_timestamp) {
  const newTimestamp = new Date(_timestamp).getTime();
  return isNumeric(newTimestamp);
}

/**
 * Checks that an input is a number
 * @param {*} n 
 * @returns {boolean} true /false if n is number
 */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function decendingSort(a, b) {
  if (b[1] === a[1]) {
    return 0;
  }
  else {
    return (b[1] < a[1]) ? -1 : 1;
  }
};

/**
 * Take EPOCH and converts and returns yyyy/mm/dd
 * @param {*} epochTime 
 * @returns {eTime} yyyy/mm/dd format
 */
function searchDateConverter(epochTime) {
  epochTime = Number(epochTime);
  var eTime = new Date(epochTime);
  var dd = eTime.getDate();

  var mm = eTime.getMonth() + 1;
  var yyyy = eTime.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }
  eTime = yyyy + '/' + mm + '/' + dd;
  return eTime;
}

/**
* Checks the string for unsafe characters and replaces with appropriate HTML
*/
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


