/**
 * Action for coutning the inbox
 * Checks first if a prior count value was stored in the cache
 * Do a search for ALL (included archived) messages
 * Count number thread returned in the batch 
 *    (will be = to 'inc' until the last page of threads)
 * For Inboxes larger than 17,000 the script wont finish before the time limit,
 *    so the script will take the max count reached and put it into the cache when time is up.
 * 
 * @param {inc} - Global variable for increment of page size in couting emails
 * @return {total} total inbox count
 */

function getInboxCount(inc) {
  
  let total = 0;
  const scriptStart = new Date();

  let inBoxCache = cache.getNumber('inBoxCache');
  if (inBoxCache === null){
    inBoxCache = 0
    Logger.log (`${user} - Starting Inbox count from 0`);
  }else{
    inBoxCache = parseInt(inBoxCache);
  }
  const inBoxCounted = cache.getBoolean('inBoxCounted');

  if (inBoxCounted){
    Logger.log (`${user} - Using cached Inbox count of: ${inBoxCache}`);
    return inBoxCache;
  }else if (inBoxCache != null){
    Logger.log(`${user} - Resuming Inbox count from ${inBoxCache}`);
      total += inBoxCache;
  }
  
  do {
    var page = GmailApp.search('', total, inc); /** * GAS wont accept 'let' here, need to use 'var'. 
    * Must use null 'GmailApp.search' vs 'GmailApp.getInboxThreads' to return any archived messages. */ 
   
    if (isTimeUp_(scriptStart, timeOutLimit)) {
      /** * When script runs close to the 5 min timeout limit take the count, 
       * cache it and set a trigger to researt after 2 mins */
      Logger.log(`${user} - Setting Trigger to resume counting InBox at ${total}`)
        cache.putNumber('inBoxCache', total); // cache for 23 hours
        cache.putBoolean('inBoxCounted', true); // cache for 23 hours
      setMoreTrigger('countMore'); //set trigger to restart script
      return false
    } 
    
    total += page.length;

} while (page.length > 0);

  Logger.log(`${user} - The total Inbox is ${total}`);
  cache.putNumber('inBoxCache', total); // cache for 23 hours
  cache.putBoolean('inBoxCounted', true); // cache for 23 hours
  return total;
}