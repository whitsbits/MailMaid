/**
 * Build InBox Processing rule into Array and save user inputs to PropertiesService.
 * @param {Object} e - Event from add-on server
 * @return {{[newKey] : jarray}} Retention Rule Array saved to PropertiesService
 */

function captureFormData(e) {
        var userProperties = PropertiesService.getUserProperties();
        var search = e.formInput.search;
        var days = e.formInput.days;
        var action = e.formInput.action;
        var rule = [action, search, days];
        var keys = userProperties.getKeys();
        var ruleNumber = keys.length + 1;
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
  var atHour = e.formInput.atHour;
  var amPM = e.formInput
  var everyDays = e.formInput.everyDays;
if (amPM = PM){
  militaryTime = atHour + 12;
}else{
  militaryTime = atHour;
}
try {
  setTrigger(militaryTime, everyDays)
} 
catch (e) {
  return `Error: ${e.toString()}`;
}
return notify(`Retention schedule saved to run every ${everyDays} at ${atHour} ${amPM}`);
}