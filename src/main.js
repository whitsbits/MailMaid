/**
 * Callback for rendering the main card.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 */
 function onHomepage(e) {
    const builder = CardService.newCardBuilder();
  
    const search = CardService.newTextInput().setTitle('GMail Search String')
        .setFieldName('search')
        .setValue('/"category:promotions/"')
        .setHint(`Use standard GMail Query Language`);
  
    const days = CardService.newTextInput().setTitle('How many days until action')
        .setFieldName('days')
        .setValue('200')
        .setHint(`How many days before the retention manager processes the action.`);
  
    const submitAction = CardService.newAction()
        .setFunctionName('captureFormData')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const submitButton = CardService.newTextButton()
        .setText('Save Retention Settings')
        . setOnClickAction(submitAction);
    const optionsSection = CardService.newCardSection()
        .addWidget(search)
        .addWidget(days)
        .addWidget(submitButton);
  
    builder.addSection(optionsSection);
    return builder.build();
  }

/**
 * Action for saving user inputs.
 * @param {Object} e - Event from add-on server
 * @return {CardService.ActionResponse} result of action
 */

function captureFormData(e) {
    
    var search = e.formInput.search;
    var days = e.formInput.days;
    var action = 'purge'; //TODO: Make this a choice
  
    try {
      var userProperties = PropertiesService.getUserProperties();
      userProperties.setProperties({
        'search': search,
        'days': days,
        'action': action
      },true);
    } 
    catch (e) {
        return `Error: ${e.toString()}`;
      }
      removePurgeMoreTriggers();
      clearCache();
      callRetention();
    return notify(`Settings Saved`);
  }
  
  function runNow() {
    removePurgeMoreTriggers();
    clearCache();
    callRetention();
  }

  function callRetention () {
  var userProperties = PropertiesService.getUserProperties();
  var retentionSchedule = userProperties.getProperties();
  Logger.log (retentionSchedule)
        for (var key in retentionSchedule) {
            Logger.log('Key: %s, Value: %s', key, retentionSchedule[key]);
        }
        inBoxLooper (retentionSchedule.action, retentionSchedule.search, retentionSchedule.days);
  };

  function notify(message) {
    const notification = CardService.newNotification().setText(message);
    return CardService.newActionResponseBuilder()
        .setNotification(notification)
        .build();
  }