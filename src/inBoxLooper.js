import { getCountStart } from "./getCountStart";

function inBoxLooper(action, searchString, days, increment) {
  
  let counter = 0;
  const actionDate = new Date();
  actionDate.setDate(actionDate.getDate() - days);
  
  //Logger.log('Start Archive Process');
  //Logger.log('Start Purge Script');

    do {
      if (isTimeUp_(scriptStart, 250000)) {
        /** * Call the trigger to restart the job */
        Logger.log(
          'Inbox loop time limit exceeded. Setting a trigger to call the purgeMore function in 2 minutes.'
        );
        setPurgeMoreTrigger();
        loopBreak = 1;
        cache.put('inBoxCnt', getCountStart, 1800); // reset the cache for how far you got before time
        {
          break;
        }
      }
  
      const threads = GmailApp.search(searchString, getCountStart, increment);
            
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

      if (action == 'archive'){
        Logger.log(`${counter} total threads archived`);
      };
      if (action == 'purge'){
        Logger.log(`${counter} total threads deleted`);
      };

      Logger.log(`Finished processing from Inbox index ${countStart} to ${countStart + increment}`);
  
      countStart -= increment; // work backwarads through the inbox in incremental chunks
      
    } while (countStart > -1);
  };