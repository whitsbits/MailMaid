/**
 * Create a trigger that executes the purgeMore function two minutes from now
 */
 function setPurgeMoreTrigger() {
    ScriptApp.newTrigger('purgeMore')
      .timeBased()
      .at(new Date(new Date().getTime() + 1000 * 60 * 2))
      .create();
  }