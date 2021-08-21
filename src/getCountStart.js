/**
 * DEPRICATRED
 * set where to start the counting of the index in the inbox
 */

function getCountStart(inboxCnt, inc) {
  // find the size of the inBox and reduce it by the increment to start counting each batch
  if (inboxCnt == 0) {
    countStart = getInboxCount(inc);
  } else if (inboxCnt < inc) {
    countStart = inboxCnt;
  } else {
    countStart = inboxCnt - inc;
  }
  Logger.log(`set Count Start at ${countStart}`);
  return countStart;
}