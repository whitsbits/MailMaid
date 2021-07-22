/**
 * Deletes all triggers that call the purgeMore function.
 */
function removePurgeMoreTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    if (trigger.getHandlerFunction() === 'purgeMore') {
      ScriptApp.deleteTrigger(trigger);
    }
  }
  Logger.log('Purge Triggers Removed');
}

export { removePurgeMoreTriggers };
