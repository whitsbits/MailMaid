  function callRetention () {
  var userProperties = PropertiesService.getUserProperties();
  var retentionSchedule = userProperties.getProperties();
  for (var rule in retentionSchedule){
      var newArray = retentionSchedule[rule]
      var replace= newArray.replace(/[\[\]]/g,'');
      var array = replace.split(',');
      var action = array[0];
      var search = array[1];
      var days = array[2];

      Logger.log (`Processing inbox with rule set: ${action}, ${search}, ${days}`);
      inBoxLooper (action, search, days);
      Logger.log (`Completed processing retention schedule ${keys}`)
  }
};