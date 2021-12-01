
  
   /**
   * Function to return array of cache labels in use
   * MUST be manually maintained
   * no way to query AppScript to return this list
   */ 
  
   function getCacheArray() {
     return [
       {name:'counterCache', type:'Number', synthValue:1250},
       {name:'ruleLoopCache', type:'Number', synthValue:3},
       {name:'threadLoopCache', type:'Number',synthValue:25},
       {name:'result', type:'Object', synthValue:[{ id:3, counter:1250, action:"Purge", searchString:"category:promotions", days:7 }]},
       {name:'editRuleNum', type:'String', synthValue:'rule0'}
       ]
   }

  /**
   * Clears a named cache
   */

   function clearCache (name) {
    cache.remove(name)
    Logger.log (`${user} - Removed ${name} cache.`)
  }


  /**
   * Clears the cache(s)
   */
  
  function clearAllCache() {
    var cacheArr = getCacheArray();
    for (let i=0; i < cacheArr.length; i++) {
      var name = cacheArr[i].name;
      cache.remove(String(name));
    }
    Logger.log (`${user} - All Caches Cleared`)
    listCache();
    }

    /**
   * list the cache(s) values
   */
  function listCache() {
    var cacheArr = getCacheArray();
    var cacheList = ""
    for (let i=0; i < cacheArr.length; i++) {
      var name = cacheArr[i].name;
      var type = ("get" + cacheArr[i].type);
      var value = cache[type](String(name));
      cacheList += (name +": "+ value + "\n")  
    }
    Logger.log (user + " - \nCurrent cached values are: \n" + cacheList)
    }


    function setSyntheticCaches() {
      var cacheArr = getCacheArray();
      for (let i=0; i < cacheArr.length; i++) {
        var name = cacheArr[i].name;
        var type = ("put" + cacheArr[i].type);
        var value = cacheArr[i].synthValue;
        cache[type](String(name),value);
      }
      listCache();
    }