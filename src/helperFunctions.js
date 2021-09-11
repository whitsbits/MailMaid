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
  callRetention();
}


function clearRules() {
  var numRules =  objectLength(userProperties.getProperties());
  for (var i=1; i < numRules + 1; i++){
  UserProperties.deleteProperty(`rule${i}`);
  };
  gotoRootCard();  
};


function clearSchedule(){
    var userProperties = PropertiesService.getUserProperties();
    userProperties.deleteProperty('schedule')
    removeTriggers('GmailRetention')
    gotoRootCard();
  };



/**
 * Returns userProperties in the PropertyService
 * and converts the object to an array 
 *  * @return {rules} an 2D array with [ruleNum][rule atribute]
 */

 function getUserPropsArr() {
  var data = userProperties.getProperties();
  var dataSorted = Object.keys(data)
    .sort()
    .reduce(function (result, key){
      result[key] = data[key];
      return result;
    },
    {});
  var properties =[];
  for (var property in dataSorted){
      var propertyArray = dataSorted[property]
      .replace(/[\[\]"]/g,'')
      .split(',');
      properties.push(propertyArray)
  }
  Logger.log (`Returning userPropertiesArr ${properties}`)
  return properties;
};

function getRulesArr() {
  var rulesArr =[];
  var numRules =  objectLength(userProperties.getProperties());
    if (numRules===0) {
      return `You do not currently have any rules set`;
    }
  for (var i=1; i < numRules + 1; i++){

    var data = userProperties.getProperty(`rule${i}`);
    if (data===null) {
      return rulesArr;
    }
    var rule = data
    .replace(/[\[\]"]/g,'')
    .split(',');
    rulesArr.push(rule);
  }
  Logger.log (`Returning rulesArr ${rulesArr}`)
  return rulesArr;
};

function getScheduleArr() {
    var data = userProperties.getProperty(`schedule`);
    if (data == null) {
      return data;
    }
    var schedule = data
    .replace(/[\[\]"]/g,'')
    .split(',');
    Logger.log (`Returning scheduleArr ${schedule}}`)
  return schedule;
};


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
 * Returns userProperties in the PropertyService 
 * as text for reporting in UI
 *  * @return {text} a text blob of current userProperties rules
 */

  function reportRulesText () {
    var rules = getRulesArr();
    var text = "";
    if ((rules === null || rules.length === 0)) {
      return `You do not currently have any rules set`;
    }
    for (let i = 0; i < rules.length; i++) {
        var action = rules[i][0];
        var search = rules[i][1];
        var days = rules[i][2];
        text += ("Rule " + (i + 1) + ":\n   Action to take: " + action + "\n   Search string: " + search + "\n   Take action after\: " + days + " days \n\n")
  }
    Logger.log (`Returning ruleset text: \n ${text}`)
    return text
  };

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
    Logger.log (`Returning ruleset Arr: \n ${reportRulesArr}`)
    return reportRulesArr
  };

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
    Logger.log (`Returning Schedule Text: \n ${text}`)
    return text
  };

    // Generate a log, then email it to the person who ran the script.
function sendLogEmail() {
  var recipient = Session.getActiveUser().getEmail();
  var subject = 'Gmail Retention Results';
  var body = Logger.getLog();
  MailApp.sendEmail(recipient, subject, body);
  Logger.log (`Email sent to ${recipient}`);
}
