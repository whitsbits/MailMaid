function set_inboxCount() {
  Logger.log('Starting InBox Count');
  const cached = cache.get('inBoxCnt');
  if (cached != null) {
    // check to see if the value has been cached
    return cached;
  }
  let tot = 0;
  do {
    if (isTimeUp_(scriptStart, 260000)) {
      /** * Call the trigger to restart the job */
      Logger.log(
        `Inbox count timeout. Passing partial count of ${tot} to controller`
      );
      cache.put('inBoxCnt', tot, 1800); // cache for 30 minutes
      return tot;
      {
        break;
      }
    }
    var page = GmailApp.search('-in:inbox OR category:primary', tot, inc);
    tot += page.length;
    // Logger.log (tot + " threads counted")
  } while (page.length == inc);
  Logger.log(`The total InBox is ${tot}`);
  cache.put('inBoxCnt', tot, 1800); // cache for 30 minutes
  return tot;
}