function aRunNow() {
  removePurgeMoreTriggers();
  makeCache(70000);
  inBoxLooper ('purge','from:contact@email.cbssports.com',10)
  //callRetention();
}

    function aRunCleanNow() {
    removePurgeMoreTriggers();
    clearCache();
    callRetention();
  }