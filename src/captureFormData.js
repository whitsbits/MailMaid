/**
 * Build InBox Processing rule into Array and save user inputs to PropertiesService.
 * @param {Object} e - Event from add-on server
 * @return {{[newKey] : jarray}} Retention Rule Array saved to PropertiesService
 */

function captureFormData(e) {
        var userProperties = PropertiesService.getUserProperties();
        var search = e.formInput.search;
        var days = e.formInput.days;
        var action = 'purge'; //TODO: HARDCODED Make this a choice in the UI
        var rule = [action, search, days];
        var keys = userProperties.getKeys();
        var ruleNumber = keys.length;
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
