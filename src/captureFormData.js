/* captureFormData.js */

function captureFormData(data) {
    const { action, searchString, days } = data;
    try {
      let userProperties = PropertiesService.getUserProperties();
      userProperties.setProperties({
        'action': action,
        'searchString': searchString,
        'days': days
      });
    } 
    catch (e) {
        return `Error: ${e.toString()}`;
      }
      var stuff = userProperties.getProperties();
        for (var key in stuff) {
            Logger.log('Key: %s, Value: %s', key, stuff[key]);
}
    return `Settings Saved`;
  }
  
  export default captureFormData;
