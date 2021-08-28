/**
 * Callback for rendering the main card.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 */
 function onHomepage(e) {
    var text = reportRules();  
    const card = CardService.newCardBuilder();
    
    const reportText = CardService.newTextParagraph()
    .setText(
        text
        );
        
    const addAction = CardService.newAction()
        .setFunctionName('addRule')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const addButton = CardService.newTextButton()
        .setText('Edit/Add New Retention Rule')
        .setOnClickAction(addAction);

    const clearAction = CardService.newAction()
        .setFunctionName('clearProperties')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const clearButton = CardService.newTextButton()
        .setText('Clear all Retention Rules')
        .setOnClickAction(clearAction);
        
    const reportBody = CardService.newCardSection()
        .addWidget(reportText)
        .addWidget(addButton)
        .addWidget(clearButton);
            
    card.addSection(reportBody);
    return card.build();
  }
  
  /**
 * Callback for rendering the main card.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 */
  function addRule(e) {
    const card = CardService.newCardBuilder();
  
    const search = CardService.newTextInput().setTitle('GMail Search String')
        .setFieldName('search')
        .setValue('category:promotions')
        .setHint(`Use standard GMail Query Language`);
  
    const days = CardService.newTextInput().setTitle('How many days until action')
        .setFieldName('days')
        .setValue('15')
        .setHint('How many days before the retention manager processes the action.');

    const action = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle('Which action do you want the retention manager to take?')
        .setFieldName('action')
        .addItem('Purge', 'purge', true)
        .addItem('Archive', 'archive', false);
  
    const saveAction = CardService.newAction()
        .setFunctionName('captureFormData')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const saveButton = CardService.newTextButton()
        .setText('Save Retention Rule')
        .setOnClickAction(saveAction);

    const optionsSection = CardService.newCardSection()
        .addWidget(search)
        .addWidget(days)
        .addWidget(action)
        .addWidget(saveButton);
  
    card.addSection(optionsSection);
    return card.build();
    //return CardService.newNavigation().updateCard(card.build());
  }

  function notify(message) {
    const notification = CardService.newNotification().setText(message);
    return CardService.newActionResponseBuilder()
        .setNotification(notification)
        .build();
  }