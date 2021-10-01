/**
 * Helper fucntions to help run scrips.
 */

/**
 * Sets the environmental variable to baseline before running the main process
 */

function GMailRetention() {
    removeTriggers('purgeMore');
    callRetention();
  }

  /**
 * Wrapper for the purge function called by timeOut trigger
 */
 function purgeMore() {
  removeTriggers('purgeMore');
  callRetention();
}

  /**
 * Function to clear all rules data from the userProperties
 */
function clearAllRules() {
  var numRules =  objectLength(userProperties.getProperties());
  for (var i = 1; i < numRules + 1; i++){
    userProperties.deleteProperty(`rule${i}`);
  };
  Logger.log (`Deleted ${i - 1} rules.`);
  return notify(`Rules Cleared`, rulesManagerCard());
};

function clearRules() {
  var numRules =  objectLength(userProperties.getProperties());
  for (var i = 1; i < numRules + 1; i++){
    userProperties.deleteProperty(`rule${i}`);
  };
  Logger.log (`Deleted ${i - 1} rules.`);
};

function clearSelectedRule(e) {
  let ruleNum  = e.parameters.ruleNum.toString()
  if (ruleNum === 'rule0') { 
    return notify('Please select a rule from the list above', rulesManagerCard())
  }else{
    userProperties.deleteProperty(ruleNum);
    reIndexRules();
    Logger.log (`Deleted ${ruleNum}`);
    return notify(`Rule ${ruleNum} cleared`, rulesManagerCard());
  }
};

  /**
 * Function to Clear the schedule data from the userProperties
 * @returns Notification and rebuiild of schedule card
 */
function clearSchedule(){
    var userProperties = PropertiesService.getUserProperties();
    userProperties.deleteProperty('schedule');
    removeTriggers('GmailRetention');
    return notify(`Schedule Cleared`, scheduleCard());
  };

/**
 * Put or remove data into cache
 */

 function makeCache (name, data) {
  cache.put(name, data, 82800) //23 hour cache
  Logger.log (`Added ${name} cache with value: ${data}`)
}

function clearCache (name) {
  cache.remove(name)
  Logger.log (`Removed ${name} cache.`)
}


/**
 * Returns userProperties in the PropertyService
 * sorts the objects and converts the object to an array 
 *  * @return {userProperties} an 2D array
 */

 function getUserPropsArr() {
  var data = userProperties.getProperties();
  keys = Object.keys(data),
  i, len = keys.length;
  keys.sort();

  var properties =[];
  for (var i = 0; i < len; i++) {
    k = keys[i];
      var propertyValue = data[k]
      //.replace(/[\[\]"]/g,'')
      .split(',');
      properties.push(propertyValue)
  }
  Logger.log (`Returning userPropertiesArr ${properties}`)
  return properties;
};

/**
 * Returns userProperties in the PropertyService
 * sorts the objects and converts the object to an array 
 *  * @return {rules} an 2D array with [ruleNum][rule atribute]
 */
function getRulesArr() {
  var keys = getRuleKeys();
  var rulesArr =[];
  if (keys.length === 0 ) {
    rulesArr = `You do not currently have any rules set`;
  }
  i, len = keys.length;
  keys.sort();

  for (var i = 0; i < len; i++) {
      k = keys[i];
      ruleValue = userProperties.getProperty(k)
      .replace(/[\[\]"]/g,'')
      .split(',');
      rulesArr.push(ruleValue)
  }
  Logger.log (`Returning getRulesArr ${rulesArr}`)
  return rulesArr;
};

/**
 * Returns userProperties in the PropertyService
 * sorts the objects and converts the object to an array 
 *  * @return {schedule} an 2D array with [numDays][onHour]
 */
function getScheduleArr() {
    var data = userProperties.getProperty(`schedule`);
    if (data === null) {
      return data;
    }
    var schedule = data
    .replace(/[\[\]"]/g,'')
    .split(',');
    Logger.log (`Returning scheduleArr ${schedule}`)
  return schedule;
};

/**
 * Determines where the prior run of scripts stopped and
 * restarts script based on prior state of cached values
 *  * @return {countStart} the index number for where to start the process
 */
function getCountStart() {
  const inBoxCached = cache.get('inBoxCache');
  let threadsCached = cache.get('threadLoopCache');
  if (inBoxCached === null) {
    countStart = getInboxCount(inc);
    // check to see if the value has been cached
  }else if (threadsCached === null) {
    countStart = inBoxCached;
    Logger.log (`Using cached Inbox of: ${inBoxCached}`)
  }else{
    countStart = threadsCached;
    Logger.log (`Using cached threads of: ${threadsCached}`)
  };
  Logger.log (`Returning Starting count of ${countStart}`)
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
  Logger.log (`Returning objectLength ${length}`)
  return length;
};


/**
 * Counts the number of rules in the userProperty store=
 *  * @return {numRules} an integer of the number of rules
 */
function getRuleKeys() {
    var keys = userProperties.getKeys();
    var ruleKeys = keys.filter(function(item) {
    return item !== 'schedule'
});
return ruleKeys;
}

function countRules(){
  ruleCount = getRuleKeys().length
Logger.log (`countRules returned ${ruleCount}`)
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
        text += ("Rule " + (i + 1) + ":\n   Action to take: " + action + "\n   Search string: " + search + "\n   Take action after\: " + days + " days \n\n")
  }
    Logger.log (`Returning reportRulesText: \n ${text}`)
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
        reportRulesArr.push ("Rule " + (i + 1) + ":\n   Action to take: " + action + "\n   Search string: " + search + "\n   Take action after\: " + days + " days \n\n")
  }
    Logger.log (`Returning reportRulesArr: \n ${reportRulesArr}`)
    return reportRulesArr
  };

  /**
 * Returns the element attributes of the named rule
 *  * @param {ruleNum} the string for the rule number (rule1)
 *  * @return {ruleElements} an array with [action][search][days]
 */
  function reportRulesArrElements (ruleNum) {
    const rule = userProperties.getProperty(ruleNum);
    let ruleElemArray = [];
    ruleElemArray = rule
      .replace(/[\[\]"]/g,'')
      .split(',');
    Logger.log (`Returning reportRulesArrElements for ${ruleNum}: \n ${rule}`)
    return ruleElemArray  };

  function reportSchedule () {
    var schedule = getScheduleArr();
      var text = ''
    Logger.log (schedule);
    if (schedule == null) {
      text = `You do not currently have any schedule set`;
      return text
    }
        var everyDays = schedule[0];
        var militaryTime = schedule[1];

      text = `You are running the schedule: \n   Every: ${everyDays} day(s) \n   Hour: ${militaryTime}h \n\n`
    Logger.log (`Returning reportSchedule Text: \n ${text}`)
    return text
  };

  function reIndexRules() {
    var rules = getRulesArr();
    var keys = getRuleKeys();
    keys.sort();
    Logger.log (keys);
    clearRules();
    for (i = 0; i < keys.length; i++) {
      var newKey = `rule${i + 1}`;
      userProperties.setProperty(newKey,JSON.stringify(rules[i]));
      Logger.log(`Reindexed ${keys[i]} with value ${rules[i]} to ${newKey}.`)
    }
    Logger.log (`Rules property store reindexed`)
  }



    // Generate a log, then email it to the person who ran the script.
function sendLogEmail() {
  var recipient = Session.getActiveUser().getEmail();
  var subject = 'Gmail Retention Results';
  var body = Logger.getLog();
  MailApp.sendEmail(recipient, subject, body);
  Logger.log (`Email sent to ${recipient}`);
}
