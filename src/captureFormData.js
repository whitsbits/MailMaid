/**
 * Build InBox Processing rule into Array and save user inputs to PropertiesService.
 * {{[newKey] : jarray}} Cleaner Rule Array saved to PropertiesService
 * @param {Object} e - Event from add-on server
 * @return {notify with Card to be built}
 */

function captureRuleFormData(e) {
        var userProperties = PropertiesService.getUserProperties();
       
        var search = e.formInput.search;
        var days = e.formInput.days;
        var action = e.formInput.action;

        if (e.parameters.ruleNum === undefined){
          var key =  null;
        }else{
          var key = e.parameters.ruleNum.toString();
        }
      /*
        //Keep for dev debugging without needing UI 
       var search = "foo";
        var days = 7;
        var action = "Purge";
        var key = '{}';
      */
      
      if (licenseRead() = false && countRules() < 1 ){
        return notify (`Unlicensed product are limited to only one Rule`)
      }  

        var ruleNum = (countRules() + 1);
        var rule = [action, search, days];
        if (key === 'rule0') {
          return notify ("Select a rule from above to Replace, otherwise Save As a New Rule", rulesManagerCard())
        }
        if (key === null) {
          key = ('rule' + ruleNum);
        }
        var jarray = JSON.stringify(rule);
        Logger.log (`${user} - Key set as ${key}`);
    try {
      var userProperties = PropertiesService.getUserProperties();
      userProperties.setProperties({[key] : jarray});
    } 
    catch (e) {
      Logger.log (`${user} - Error: ${e.toString()}`);  
      return `Error: ${e.toString()}`;
      }
      Logger.log (`${user} - Cleaner Settings Saved as ${key}`);
      return notify(`Cleaner Settings Saved as ${key}`, rulesManagerCard());
  }


  /**
 * Build InBox Processing rule into Array and save user inputs to PropertiesService.
 * Cleaner shchedule set to Triggers
 * @param {Object} e - Event from add-on server
@return {notify with Card to be built}
 */

function captureScheduleFormData(e) {
  var everyDays = parseInt(e.formInput.everyDays,10);
  var atHour = parseInt(e.formInput.atHour,10);
  var schedule = [everyDays, atHour];
  var jarray = JSON.stringify(schedule);

try {
  var userProperties = PropertiesService.getUserProperties();
  var data = userProperties.getProperty('schedule');
  if (data == null){
    userProperties.setProperties({'schedule' : jarray});
    removeTriggers('MailMaid');
    setTrigger('MailMaid', atHour, everyDays);  
  }
  userProperties.deleteProperty('schedule')
  userProperties.setProperties({'schedule' : jarray});
  removeTriggers('MailMaid');
  setTrigger('MailMaid', atHour, everyDays);
} 
catch (e) {
  Logger.log (`${user} - Error: ${e.toString()}`);
  return `Error: ${e.toString()}`;
}
Logger.log (`${user} - MailMaid schedule saved to run every ${everyDays} day(s) at ${atHour}`);
return notify(`MailMaid schedule saved to run every ${everyDays} day(s) at ${atHour}`, scheduleCard());
}


