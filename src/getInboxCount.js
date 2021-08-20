/**
 * Action for saving user inputs.
 * @param {inc} - Global variable for increment of page size in couting emails
 * @return {total} total inbox count
 */

function getInboxCount(inc) {
  Logger.log('Starting InBox Count');
  const cached = cache.get('inBoxCache');
  if (cached != null) {
    // check to see if the value has been cached
    Logger.log ('Using cached Inbox count');
    return cached;
  }
  let total = 0;
  
  do {
    var page = GmailApp.search('', total, inc); /** * GAS wont accept 'let' here, need to use 'var'. 
    * Must use null 'GmailApp.search' vs 'GmailApp.getInboxThreads' to return any archived messages. */ 
   
    if (isTimeUp_(scriptStart, 240000)) {
      /** * When script runs close to the 5 min timeout limit take the count, 
       * cache it and set a trigger to researt after 2 mins */
      Logger.log(
        `Inbox count timeout. Passing partial count of ${total} to controller`
      );
      cache.put('inBoxCache', total, 1800); // cache for 30 minutes
      setPurgeMoreTrigger(); //set triggr to restart script
      Logger.log('Setting Trigger to resume script')
      return total;
      } 
    
    total += page.length;
    //Logger.log (`${total} threads counted so far`)

} while (page.length > 0);
  Logger.log(`The total InBox is ${total}`);
  cache.put('inBoxCache', total, 1800); // cache for 30 minutes
  return total;
}