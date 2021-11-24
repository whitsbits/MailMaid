function getCountStart() {
    let inBoxCache = cache.get('inBoxCache');
if (inBoxCache === null){
  inBoxCache = 0
  Logger.log (`${user} - Starting Inbox count from 0`);
}else{
  inBoxCache = parseInt(inBoxCache);
}
const inBoxCounted = JSON.parse(cache.get('inBoxCounted').toLowerCase());

if (inBoxCounted){
  Logger.log (`${user} - Using cached Inbox count of: ${inBoxCache}`);
  return inBoxCache;
}else if (inBoxCache != null){
  Logger.log(`${user} - Resuming Inbox count from ${inBoxCache}`);
    total += inBoxCache;
}
}