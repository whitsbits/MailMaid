function inBoxLooper(type) {
    do {
      if (isTimeUp_(scriptStart, 250000)) {
        /** * Call the trigger to restart the job */
        Logger.log(
          'Inbox loop time limit exceeded. Setting a trigger to call the purgeMore function in 2 minutes.'
        );
        setPurgeMoreTrigger();
        loopBreak = 1;
        cache.put('inBoxCnt', countStart, 1800); // reset the cache for how far you got before time
        {
          break;
        }
      }
  
      if (type == 0) {
        var threads = GmailApp.search(
          'category:(primary OR purchases)',
          countStart,
          inc
        );
      }
  
      if (type == (1 || 2)) {
        var threads = GmailApp.search(
          'label:unimportant category:(updates -purchases -primary))',
          countStart,
          inc
        );
      }
  
      for (let i = 0; i < threads.length; i++) {
        const msgDate = threads[i].getLastMessageDate();
  
        if (type == 0) {
          if (msgDate < archiveDate) {
            threads[i].moveToArchive();
            ++archiveCounter;
          }
        }
  
        if (type == 1) {
          if (msgDate < purgeDate) {
            threads[i].moveToTrash();
            ++purgeCounter;
          }
        }
  
        if (type == 2) {
          const messages = threads[i].getMessages();
          Logger.log(messages[0].getFrom());
        }
      }
      Logger.log(
        `Finished processing from Inbox index ${countStart} to ${
          countStart + inc
        }`
      );
  
      countStart -= inc; // work backwarads through the inbox in incremental chunks
      // Logger.log (purgeCounter + " purged from categories thus far")
      // Logger.log (archiveCounter + " archived from Inbox thus far")
    } while (countStart > -1);
  }