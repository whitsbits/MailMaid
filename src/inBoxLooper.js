/**
 * Callback for rendering the main card.
 * @param {Object} action - the action the script will take, e.g. purge, archive, etc.
 * @param {Object} search - the Gmail search string for the mail to be processed
 * @param {Object}  days - number of days after whcih the mail is processed
 * @return processed messaages
 */

const scriptStart = new Date();
let purgeCounter = 0;
const cache = CacheService.getUserCache();
const inc = 500; // InBox Iteration Increment

function inBoxLooper(action, searchString, days) {
  
  let counter = 0;
  const actionDate = new Date();
  actionDate.setDate(actionDate.getDate() - days);
  let countStart = getInboxCount(inc);

    do {
      if (isTimeUp_(scriptStart, 240000)) {
        /** * When script runs close to the 5 min timeout limit take the count, 
         * cache it and set a trigger to researt after 2 mins */
        Logger.log(
          'Inbox loop time limit exceeded. Setting a trigger to call the purgeMore function in 2 minutes.'
        );
        setPurgeMoreTrigger();
        cache.put('inBoxCache', countStart, 1800); // reset the cache for how far you got before timeOut
        {
          break;
        }
      }
  
      const threads = GmailApp.search(searchString, countStart, inc);
            
      for (let i = 0; i < threads.length; i++) {
        const msgDate = threads[i].getLastMessageDate();
  
        if (action == 'archive') {
                    
          if (msgDate < actionDate) {
            threads[i].moveToArchive();
            ++counter;
          }
        }
          if (action == 'purge') {
          if (msgDate < actionDate) {
            threads[i].moveToTrash();
            ++counter;
          }
        }
      };

  
      countStart -= inc; // work backwarads through the inbox in incremental chunks
      
    } while (countStart > -1);

    if (action == 'archive'){
      Logger.log(`${counter} total threads archived`);
    };
    if (action == 'purge'){
      Logger.log(`${counter} total threads deleted`);
    };

    Logger.log(`Finished processing from Inbox index ${countStart} to ${countStart + inc}`);
  };