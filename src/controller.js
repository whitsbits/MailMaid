function controller() {
    removePurgeMoreTriggers();
    if (loopBreak == 0) {
      set_countStart();
      switch(action) {
        case "Archive":
          Logger.log('Start Archive Script');
          const type = 0; // main inbox
          inBoxLooper(type);
          Logger.log(`${archiveCounter} total Category threads archived`);
          break;
        case "Purge":
          Logger.log('Start Purge Script');
          const type = 1; // category tabs
          inBoxLooper(type);
          Logger.log(`${purgeCounter} total Category threads deleted`);
          break;
        case "2":
          Logger.log('Start Sender Script');
          const type = 2; // category tabs
          inBoxLooper(type);
          break;
        default:
          text = "I have never heard of that fruit...";
      }
  }
}
