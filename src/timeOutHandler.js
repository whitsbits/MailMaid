/**
 * Aircode example to figure out how to deal with timeOut and restart at current state
 * in the middle of any one of a number of nested loops
 * 
 * How to take the relevant inputs to the process state
 * recover them from cache if the script is awoken by trigger (or default them back to init)
 * when the script timesout, store the inputs that are needed to restart the process.
 * 
 */

function mainProcess(inputA, inputB, inputEtc) {

    /* recover any variable from state or set to initialized value
    * this is repetitve for each state var and want to make abstract
    * Set the init for the start value or the cached value */

    let inputACached = checkTimeOutCache(inputA, 0)

    let searchBatchCache = cache.getNumber('searchBatchCache');
    let searchBatchStart = 0;
    if (searchBatchCache !== null) {
        searchBatchStart = searchBatchCache;
    };

    let threadsCached = cache.getNumber('threadsCache');
    let threadsCount = 0;
    if (threadsCached !== null) {
        threadsCount = threadsCached;
    };

    var threads = GmailApp.search(query, searchBatchStart, inc); //


    for (var i = threadsCount; i < threads.length; i++) {

        // Do something

        if (isTimeUp_(scriptStart, timeOutLimit)) {
            cache.putSrting('inputACache', inputA, ttl);
            cache.putNumber('threadsCache', i, ttl);

            /**
           * Set the trigger to resume after timeout ends (60min for Add-ons)
           * This is also repetitive for each loop
           */
            if (triggerActive('doMore') === false) {
                Logger.log(`${user} - Setting a trigger to call the doMore of mainProcess function.`)
                setMoreTrigger('doMore');
            } else {
                Logger.log(`${user} - Next trigger already Set`)
            };
            break;
        };

        /**
         * Pattern repeats for each nested loop
         */
        for (var j = jCount; j < messages.length; j++) {

            // Do something

             // timout can happen in any nested loop so this need to be repeated
            if (isTimeUp_(scriptStart, timeOutLimit)) {
                /** repeat the pattern but now add all the vars that are
                 * important to this block
                 * This list can get very long an unmanageable
                 */
            };

            for (var k = kCount; k < attchemnts.length; k++) {

                // Do something

                // timout can happen in any nested loop so this need to be repeated
                if (isTimeUp_(scriptStart, timeOutLimit)) {
                    /** repeat the pattern but now add all the vars that are
                     * important to this block
                     * This list can get even longer an more unmanageable
                     */
                };
            };
        };
        /**
     * Take any results and store the data needed for the final results report
     * Store the array in the cache
     * clean up the loop placeholder interstitial caches
     */
        let resultsCached = cache.getObject('result'); //this block looks familiar!!!
        let resultsArr = resultsCached
        if (resultsCached === null) {
            resultsArr = [];
        };

        resultsArr.push({ stuff: "things" }); 
        cache.putObject('result', resultsArr); // stash all the resutls
        Logger.log(`${user} - Finished processing first outer loop`);
        clearCache('threadsCache'); // reset any cache that needs to be reinitialized for next cycle
    };

    /**
     * Cleanup aisle cached and trigger!
     * And send the final tally result
     */
    clearCache('allTheThings'); // clear all caches used in the function
    removeTriggers('doMore'); // clear all trigers used in the function
    sendReportEmail('MailMaid Results', 'src/report-email.html', resultsArr); // finish the work
};