  function callRetention () {
  var userProperties = PropertiesService.getUserProperties();
  var retentionSchedule = userProperties.getProperties();
  Logger.log (retentionSchedule)
        for (var key in retentionSchedule) {
            Logger.log('Key: %s, Value: %s', key, retentionSchedule[key]);
        }
        inBoxLooper (retentionSchedule.action, retentionSchedule.search, retentionSchedule.days);
  };