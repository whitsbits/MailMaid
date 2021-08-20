/**
 * Callback for rendering the main card.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 */
 function onHomepage(e) {
    const builder = CardService.newCardBuilder();
  
    const search = CardService.newTextInput().setTitle('GMail Search String')
        .setFieldName('search')
        .setValue('category:promotions')
        .setHint(`Use standard GMail Query Language`);
  
    const days = CardService.newTextInput().setTitle('How many days until action')
        .setFieldName('days')
        .setValue('15')
        .setHint(`How many days before the retention manager processes the action.`);
  
    const saveAction = CardService.newAction()
        .setFunctionName('captureFormData')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const saveButton = CardService.newTextButton()
        .setText('Save Retention Rule')
        .setOnClickAction(saveAction);

    const runAction = CardService.newAction()
        .setFunctionName('aRunCleanNow')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const runButton = CardService.newTextButton()
        .setText('Run retention process')
        .setOnClickAction(runAction);

    const optionsSection = CardService.newCardSection()
        .addWidget(search)
        .addWidget(days)
        .addWidget(saveButton)
        .addWidget(runButton);
  
    builder.addSection(optionsSection);
    return builder.build();
  }

  function notify(message) {
    const notification = CardService.newNotification().setText(message);
    return CardService.newActionResponseBuilder()
        .setNotification(notification)
        .build();
  }