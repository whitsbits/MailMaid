
/**
 * Callback for rendering the main card.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 */
 function onHomepage(e) {
    const builder = CardService.newCardBuilder();
  
    const searchString = CardService.newTextInput().setTitle('GMail Search String')
        .setFieldName('GMail Search String')
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
        .addWidget(searchString)
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
    const action = 'Purge' //TODO: Make this a choice
    const searchString = e.formInput.searchString;
    let days = e.formInput.days;
  
    try {
      let userProperties = PropertiesService.getUserProperties();
      userProperties.setProperties({
        'action': action,
        'searchString': searchString,
        'days': days
      });
    } 
    catch (e) {
        return `Error: ${e.toString()}`;
      }
      var stuff = userProperties.getProperties();
        for (var key in stuff) {
            Logger.log('Key: %s, Value: %s', key, stuff[key]);
}
    return `Settings Saved`;
  }
  
  