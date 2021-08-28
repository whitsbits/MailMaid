/**
 * Build InBox Processing rule into Array and save user inputs to PropertiesService.
 * @param {Object} e - Event from add-on server
 * @return {{[newKey] : jarray}} Retention Rule Array saved to PropertiesService
 */

function captureFormData(e) {
        const userProperties = PropertiesService.getUserProperties();
        const search = e.formInput.search;
        const days = e.formInput.days;
        const action = e.formInput.action;
        const rule = {
          action: this.action,
          search: this.search,
          days: this.days
        };
        var keys = userProperties.getKeys();
        var ruleNumber = keys.length;
        var newKey = ('rule' + ruleNumber);
        //var jarray = JSON.stringify(rule);
        Logger.log (rule)
        Logger.log (typeof rule)
    try {
      userProperties.setProperties({[newKey] : rule});
    } 
    catch (e) {
        return `Error: ${e.toString()}`;
      }
    return notify(`Retention Settings Saved as ${newKey}`);
  }
