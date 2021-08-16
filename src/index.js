import captureFormData from "./captureFormData.js"
import onHomepage from "./main.js"

const scriptStart = new Date();
const inboxCnt = 0;
let countStart = 0;
const cache = CacheService.getUserCache();
let loopBreak = 0;
const inc = 200; // InBox Iteration Increment


global.captureFormData = captureFormData;
global.onHomepage = onHomepage;
