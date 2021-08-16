
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