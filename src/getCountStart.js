function getCountStart() {
  // find the size of the inBox and reduce it by the increment to start counting each batch
  if (inboxCnt == 0) {
    inboxCnt = getInboxCount();
  }
  if (inboxCnt < inc) {
    countStart = inboxCnt;
    inc = 1;
  } else {
    countStart = inboxCnt - inc;
  }
  Logger.log(`set Count Start at ${countStart}`);
  return countStart;
}

export { getCountStart };