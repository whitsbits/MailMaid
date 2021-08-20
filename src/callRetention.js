  function callRetention () {
  var userProperties = PropertiesService.getUserProperties();
  var retentionSchedule = userProperties.getProperties();
  Logger.log (retentionSchedule)
        for (var key in retentionSchedule) {
            Logger.log('Key: %s, Value: %s', key, retentionSchedule[key]);
        }
        for (var key in retentionSchedule){
          var action = retentionSchedule[0];
          var search = retentionSchedule[1];
          var days = retentionSchedule[2];
          inBoxLooper (action, search, days);
          Logger.log (`Completed processing retention schedule ${key}`)
        } 
  };