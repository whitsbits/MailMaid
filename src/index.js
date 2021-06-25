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

import controller from "./controller"

global.controller = controller;
