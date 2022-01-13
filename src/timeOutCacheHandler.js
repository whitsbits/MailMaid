//automatically invoked from outerLoop()'s creation of a new trigger if required to get work done
function outerLoopRepeating() {
  outerLoop();
}
// trigger this function
function outerLoop() {
  try {
    var processingMessage = 'Initialising', isOverMaxRuntime = false, startTime = new Date(), // calc elapsed time
        functionName = arguments.callee.name, repeatingFunctionName = functionName + 'Repeating'; //for logging, triggering
    
    // Deletes all occurrences of the Repeating trigger we don't end up with undeleted time based triggers all over the place
    //add library GASRetry MGJu3PS2ZYnANtJ9kyn2vnlLDhaBgl_dE
    GASRetry.call(function(){ScriptApp.getProjectTriggers().forEach(function(i) {
      if (i.getHandlerFunction() === repeatingFunctionName) {ScriptApp.deleteTrigger(i);}
    });});
    
    Logger.log('========== Starting the "%s" function ==========', functionName);
    
    // Handle max execution times in our outer loop
    // Get start index if we hit max execution time last run
    var start = parseInt(PropertiesService.getScriptProperties().getProperty(functionName + "-start")) || 0;
    
    var thingies = ['stuff to process', 'in an Array',,,,]; //
    for (var i = start ; i < thingies.length; i++) {
      if (Math.round((new Date() - startTime)/1000) > 300) { //360 seconds is Google Apps Script max run time
        //We've hit max runtime. 
        isOverMaxRuntime = true;
        break;
      }
      //do our work here
      Utilities.sleep(100);
      Logger.log('Inside the for loop that does the xyz work. i is currently: %d', i);
      var processingMessage = Utilities.formatString('%d of %d thingies: %s <%s>',  i+1, thingies.length, 'foo','bar');
      
      //do our work above here
    }
    if (isOverMaxRuntime) {
      //save state in user/project prop if required
      PropertiesService.getScriptProperties().setProperty(functionName + '-start', i);
      //create another trigger
      GASRetry.call(function(){ScriptApp.newTrigger(repeatingFunctionName).timeBased().everyMinutes(10).create();});
      Logger.log('Hit max run time - last iteration completed was i=%s', i-1);
    } else {
      Logger.log('Done all the work and all iterations');
      PropertiesService.getScriptProperties().deleteProperty(functionName + '-start');
      Logger.log('Completed processing all %s things with the "%s" function', thingies.length, functionName);
    }
  } catch (e) {
    Logger.log('%s. While processing %s', JSON.stringify(e, null, 2), processingMessage);
    throw e;
  }
}