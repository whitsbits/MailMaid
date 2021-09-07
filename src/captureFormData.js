/**
 * Build InBox Processing rule into Array and save user inputs to PropertiesService.
 * @param {Object} e - Event from add-on server
 * @return {{[newKey] : jarray}} Retention Rule Array saved to PropertiesService
 */

function captureRuleFormData(e) {
        var userProperties = PropertiesService.getUserProperties();
        var search = e.formInput.search;
        var days = e.formInput.days;
        var action = e.formInput.action;
        var rule = [action, search, days];
        var ruleNumber = (getRulesArr().length + 1);
        var newKey = ('rule' + ruleNumber);
        var jarray = JSON.stringify(rule);

    try {
      var userProperties = PropertiesService.getUserProperties();
      userProperties.setProperties({[newKey] : jarray});
    } 
    catch (e) {
        return `Error: ${e.toString()}`;
      }
    return notify(`Retention Settings Saved as ${newKey}`);
  }


  /**
 * Build InBox Processing rule into Array and save user inputs to PropertiesService.
 * @param {Object} e - Event from add-on server
 * @return {Notify} Retention shchedule set to Triggers
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
    removeTriggers('GMailRetention');
    setTrigger('GMailRetention', atHour, everyDays);  
  }
  userProperties.deleteProperty('schedule')
  userProperties.setProperties({'schedule' : jarray});
  removeTriggers('GMailRetention');
  setTrigger('GMailRetention', atHour, everyDays);
} 
catch (e) {
  return `Error: ${e.toString()}`;
}
return notify(`Retention schedule saved to run every ${everyDays} day(s) at ${atHour}`);
}