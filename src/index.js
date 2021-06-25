const scriptStart = new Date();
const inc = 200; // InBox Iteration Increment
const inboxCnt = 0;
let countStart = 0;
let purgeCounter = 0;
const cache = CacheService.getUserCache();
let loopBreak = 0;
const purgeDays = 20; // Enter # of days before messages are moved to archive
const purgeDate = new Date();
purgeDate.setDate(purgeDate.getDate() - purgeDays);
Logger.log(`Purge Date is ${purgeDate}`);
let archiveCounter = 0;
const archiveDays = 365; // Enter # of days before messages are moved to archive
const archiveDate = new Date();
archiveDate.setDate(archiveDate.getDate() - archiveDays);
Logger.log(`Archive Date is ${archiveDate}`);

function controller() {
  removePurgeMoreTriggers();
  if (loopBreak == 0) {
    set_countStart();
  }
  // if (loopBreak==0) {findSenders()};
  if (loopBreak == 0) {
    cleanCategories();
  }
  Logger.log(`${purgeCounter} total Category threads deleted`);
  if (loopBreak == 0) {
    set_countStart();
  }
  if (loopBreak == 0) {
    archiveInBox();
  }
  Logger.log(`${archiveCounter} total Category threads archived`);
}

/**
 * Wrapper for the purge function
 */
function purgeMore() {
  controller();
}

function archiveInBox() {
  Logger.log('Start Archive Script');
  const type = 0; // main inbox
  inBoxLooper(type);
}

function findSenders() {
  Logger.log('Start Sender Script');
  const type = 2; // category tabs
  inBoxLooper(type);
}

function cleanCategories() {
  Logger.log('Start Purge Script');
  const type = 1; // category tabs
  inBoxLooper(type);
}

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

    countStart -= inc; // work backwrads through the inbox in incremental chunks
    // Logger.log (purgeCounter + " purged from categories thus far")
    // Logger.log (archiveCounter + " archived from Inbox thus far")
  } while (countStart > -1);
}

global.controller = controller;
