/**
 * Helper fucntions to help run scrips.
 */

/**
 * Sets the environmental variable to baseline before running the main process
 */

function MailMaid() { 
    clearAllCache();
    removeTriggers('cleanMore');
    cleanMail();
  }

/**
 * Check that the schedule is working
 */  

function checkLastRun() {
  let schedule = getScheduleArr();
  if (schedule === null){
    initSchedule();
    schedule = getScheduleArr();
  }
  let days= parseInt((schedule[0]),10);
  Logger.log (`${user} - Has schedule MailMaid every ${days}`)
  var maxTime = Math.round(+days * 86400000)
  var lastRunEpoch = parseInt(userProperties.getProperty('lastRunEpoch'),10);
  var elapsedTime = (Date.now() - lastRunEpoch);
  if (elapsedTime > maxTime){
    Logger.log (`${user} - Schedule is failing`)
    return true
  }
  Logger.log (`${user} - Schedule is working`)
  return false
}

  /**
 * Wrapper for the purge function called by timeOut trigger
 */
 function cleanMore() {
  removeTriggers('cleanMore');
  cleanMail();
}

  /**
 * Function to clear all rules data from the userProperties
 * @return {notify with Card to be built}
 */
function clearAllRules() {
  var numRules =  objectLength(userProperties.getProperties());
  for (var i = 1; i < numRules + 1; i++){
    userProperties.deleteProperty(`rule${i}`);
  };
  Logger.log (`${user} - Deleted ${i - 1} rules.`);
  return notify(`Rules Cleared`, onHomepage());
};

  /**
 * Utility function to clear all rules data from the userProperties
 * without offering a return
 */

function clearRules() {
  var numRules =  objectLength(userProperties.getProperties());
  for (var i = 1; i < numRules + 1; i++){
    userProperties.deleteProperty(`rule${i}`);
  };
  Logger.log (`${user} - Deleted ${i - 1} rules.`);
};

  /**
 * Function to clear a user selected rules data from the userProperties
 * @param {Object} e - Event from add-on server
 * @return {notify with Card to be built}
 */
function clearSelectedRule(e) {
  let ruleNum  = e.parameters.ruleNum.toString()
  if (ruleNum === 'rule0') { 
    return notify('Please select a rule from the list above', rulesManagerCard())
  }else{
    userProperties.deleteProperty(ruleNum);
    reIndexRules();
    Logger.log (`${user} - Deleted ${ruleNum}`);
    return notify(`Rule ${ruleNum} cleared`, rulesManagerCard());
  }
};

  /**
 * Function to Clear the schedule data from the userProperties
 * @returns Notification and rebuiild of schedule card
 */
function clearSchedule(){
    userProperties.deleteProperty('schedule');
    removeTriggers('MailMaid');
    return notify(`Schedule Cleared`, scheduleCard());
  };

  /**
 * Function to initialize the schedule data to the userProperties
 */
function initSchedule() {
  let schedule = userProperties.getProperty('schedule')
  if (schedule===null){
        var atHour = 1
        var everyDays = 1
  }else{
      let schedule = getScheduleArr();
      var atHour = schedule[1]
      var everyDays = schedule[0]
  }
    userProperties.setProperties({'schedule' : JSON.stringify([atHour, everyDays])})
    removeTriggers('MailMaid');
    setTrigger('MailMaid', atHour, everyDays)
  Logger.log (`${user} - Schedule Initialized`)
}

function initRules() {
  cache.putString('editRuleNum', 'rule0');
}

  /**
 * Function to check initialization status of the app
 */
function checkInitStatus() {
    if (userProperties.getProperty('initialized') === null || 
    userProperties.getProperty('initialized') === false){
        return false;
      }else{
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
  var rulesArr =[];
  if (keys.length === 0 ) {
    rulesArr = `You do not currently have any rules set`;
    Logger.log (`${user} - Returning getRulesArr ${rulesArr}`)
    return rulesArr
  }
  i, len = keys.length;

  for (var i = 0; i < len; i++) {
      k = keys[i];
      ruleValue = userProperties.getProperty(k)
      .replace(/[\[\]"]/g,'')
      .split(',');
      rulesArr.push(ruleValue)
  }
  rulesArr.sort(function(a,b) {
    return a[3]-b[3]
});
  Logger.log (`${user} - Returning getRulesArr ${rulesArr}`)
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
    .replace(/[\[\]"]/g,'')
    .split(',');
    Logger.log (`${user} - Returning scheduleArr ${schedule}`)
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
    Logger.log (`${user} - Starting Inbox count from 0`)
  }else{
    countStart = threadsCached;
    Logger.log (`${user} - Using cached threads of: ${threadsCached}`)
  };
  return countStart
}

/**
 * Determines the length of an object
 * sorts the objects and converts the object to an array 
 *  * @return {length} an integer for the length of the object
 */
function objectLength( object ) {
  var length = 0;
  for( var key in object ) {
      if( object.hasOwnProperty(key) ) {
          ++length;
      }
  }
  Logger.log (`${user} - Returning objectLength ${length}`)
  return length;
};


/**
 * Gets the Keys from rules in the userProperty store
 *  * @return {ruleKeys} an array of key names
 */
function getRuleKeys() {
    var keys = userProperties.getKeys();
    var ruleKeys = keys.filter(function(item) {
    return (item.includes("rule"))
});
Logger.log (`${user} - getRuleKeys returned ${ruleKeys}`)
return ruleKeys;
}

/**
 * Counts the number of rules in the userProperty store=
 *  * @return {numRules} an integer of the number of rules
 */
function countRules(){
  ruleCount = getRuleKeys().length
Logger.log (`${user} - countRules returned ${ruleCount}`)
return ruleCount
}

/**
 * Returns userProperties in the PropertyService 
 * as text for reporting in UI
 *  * @return {text} a text blob of current userProperties rules
 */

  function reportRulesText () {
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
        text += ("<b>Rule " + (i + 1) + ":</b>\n   Action to take: <b><font color=\"#ff3355\">" + action + "</font></b>\n   Search string: <font color=\"#3366cc\">" + search + "</font>\n   Take action after\: <font color=\"#3366cc\">" + days + " days </font>\n\n")
  }
  if (licenseRead() === false){
    text += (`\nTo enable more than one rule, please purchase a licesne at <a href="https://mailmaid.co">mailmaid.co</a>`)
  }

    Logger.log (`${user} - Returning reportRulesText: \n ${text}`)
    return text
  };

  /**
 * Builds an array of all the rules in the userProperties
 * for the purpose of building the selectRules UI 
 *  * @return {reportRulesArr} an array of all rules in the userProperties
 */
  function reportRulesArr () {
    var rules = getRulesArr();
    var reportRulesArr = [];
    if ((rules === null || rules.length === 0)) {
      return `You do not currently have any rules set`;
    }
    for (let i = 0; i < rules.length; i++) {
        var action = rules[i][0];
        var search = rules[i][1];
        var days = rules[i][2];
        reportRulesArr.push ("<b>Rule </b>" + (i + 1) + ":\n   Action to take: " + action + "\n   Search string: " + search + "\n   Take action after\: " + days + " days \n\n")
  }
    Logger.log (`${user} - Returning reportRulesArr: \n ${reportRulesArr}`)
    return reportRulesArr
  };

  /**
 * Returns the element attributes of the named rule
 *  * @param {ruleNum} the string for the rule number (rule1)
 *  * @return {ruleElements} an array with [action][search][days][index]
 */
  function reportRulesArrElements (ruleNum) {
    const rule = userProperties.getProperty(ruleNum);
    let ruleElemArray = [];
    ruleElemArray = rule
      .replace(/[\[\]"]/g,'')
      .split(',');
    Logger.log (`${user} - Returning reportRulesArrElements for ${ruleNum}: \n ${rule}`)
    return ruleElemArray  };

  /**
 * Returns the element attributes of the schedule
 *  * @return {scheduleText} an text block for presenting schedule in UI
 */
  function reportSchedule () {
    var schedule = getScheduleArr();
      var text = ''
    if (schedule == null) {
      text = `You do not currently have any schedule set`;
      return text
    }
        var everyDays = schedule[0];
        var militaryTime = schedule[1];

      text = `MailMaid is currently schedule to work: \n   <b>Every:</b> ${everyDays} day(s) \n   <b>At Hour:</b> ${militaryTime}:00h \n\n`
    Logger.log (`${user} - Returning reportSchedule Text: \n ${text}`)
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

    for (i = 0; i < keys.length; i++) {
      var newKey = `rule${i + 1}`;
      rules[i].splice(3,1); //remove the prior index from the array
      rules[i].push(i + 1); // add the new index to the array
      userProperties.setProperty(newKey,JSON.stringify(rules[i]));
      Logger.log(`${user} - Reindexed ${keys[i]} with value ${rules[i]} to ${newKey}.`)
    }
    Logger.log (`${user} - Rules property store reindexed`)
  }



