

/**
* Function to return array of cache labels in use
* MUST be manually maintained
* no way to query AppScript to return this list.
* use synthValue for setting up synthtic cache for testing
*/

function getCacheArray() {
  return [
    { name: 'rulesCache', type: 'Number', synthValue: 3 },
    { name: 'searchBatchStartCache', type: 'Number', synthValue: 500 },
    { name: 'threadsCache', type: 'Number', synthValue: 82 },
    { name: 'counterCache', type: 'Number', synthValue: 31 },
    { name: 'result', type: 'Object', synthValue: [{ id: 3, counter: 31, action: "Purge", searchString: "category:promotions", days: 7 }] },
    { name: 'editRuleNum', type: 'String', synthValue: 'rule0' },
    { name: 'senderQueryCache', type: 'String', synthValue: "-in:spam after:2021/01/01 before:2021/12/31" },
    { name: 'sendersCache', type: 'Number', synthValue: 1000 },
    { name: 'senderChoiceCache', type: 'String', synthValue: 'Top' },
    { name: 'senderNumResult', type: 'Number', synthValue: 20 },
    { name: 'senderThreadsCache', type: 'Number', synthValue: 310 },
    { name: 'senderArr', type: 'Object', synthValue: [] },
    { name: 'senderuA', type: 'Object', synthValue: [] },
    { name: 'sendercObj', type: 'Object', synthValue: {} }
  ]
}

/**
 * Clears a named cache
 */

function clearCache(name) {
  cache.remove(name)
  Logger.log(`${user} - Removed ${name} cache.`)
}


/**
 * Clears ALLthecache(s)
 */

function clearAllCache() {
  var cacheArr = getCacheArray();
  for (let i = 0; i < cacheArr.length; i++) {
    var name = cacheArr[i].name;
    cache.remove(String(name));
  }
  Logger.log(`${user} - All Caches Cleared`)
  listCache();
}

/**
* list ALLthe cache(s) values
*/
function listCache() {
  var cacheArr = getCacheArray();
  var cacheList = ""
  for (let i = 0; i < cacheArr.length; i++) {
    var name = cacheArr[i].name;
    var type = ("get" + cacheArr[i].type);
    var value = cache[type](String(name));
    cacheList += (name + ": " + value + "\n")
  }
  Logger.log(user + " - \nCurrent cached values are: \n" + cacheList)
}

/**
* setup ALLthe cache(s) with synthetic values for testing
*/
function setSyntheticCaches() {
  var cacheArr = getCacheArray();
  for (let i = 0; i < cacheArr.length; i++) {
    var name = cacheArr[i].name;
    var type = ("put" + cacheArr[i].type);
    var value = cacheArr[i].synthValue;
    cache[type](String(name), value);
  }
  listCache();
}