/**
 * Controller fucntions to hepl run scrips for debugging and operations.
 */

function aRunNow() {
  removePurgeMoreTriggers();
  makeCache(35000);
  inBoxLooper ('purge','from:contact@email.cbssports.com',10)
  //callRetention();
}

    function aRunCleanNow() {
    removePurgeMoreTriggers();
    clearCache();
    callRetention();
  }

  function getUserProps() {
    var userProperties = PropertiesService.getUserProperties();
    for (var kind in userProperties) {
      Logger.log('A %s goes %s!', kind, userProperties[kind]);
    }
    }