const card = CardService.newCardBuilder();

/**
 * Callback for rendering the main card.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 */
 function onHomepage(e) {

    card.addSection(introSection());
    card.addSection(scheduleSection());
    card.addSection(rulesSection());

    return card.build();
  };


  function introSection() {
    var introText = "GMail retention automatically manages your email by setting rules that find messages based on GMail search criteria and can archive or purge them according to the number of days since the message was received. "
    const introBodyText = CardService.newTextParagraph()
        .setText(
            introText
        );
    const introBody = CardService.newCardSection()
        .addWidget(introBodyText);

    return introBody;
  }
  
  /**
 * Callback for rendering the rules section.
  * @return {CardService.Section} Return the section to build the card.
 */
  function rulesSection() {
    var rulesText = `Your current rules are: \n\n ${reportRules()}`;  
    const rulesBodyText = CardService.newTextParagraph()
        .setText(
            rulesText
        );  
    const addRuleAction = CardService.newAction()
        .setFunctionName('addRule')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const addRuleButton = CardService.newTextButton()
        .setText('Manage Rules')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(addRuleAction);

    const rulesBody = CardService.newCardSection()        
    .addWidget(addRuleButton)
    .addWidget(rulesBodyText);

    return rulesBody;
    };

  /**
 * Callback for rendering the schedule section.
  * @return {CardService.Section} Return the section to build the card.
 */
  function scheduleSection() {
    const scheduleText = `Your current schedule is: \n\n ${reportSchedule()}`;
    const scheduleBodyText = CardService.newTextParagraph()
        .setText(
            scheduleText
        );

    const changeScheduleAction = CardService.newAction()
        .setFunctionName('addRule')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const changeScheduleButton = CardService.newTextButton()
        .setText('Manage Schedule')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(changeScheduleAction);    
    const scheduleBody = CardService.newCardSection()
        .addWidget(changeScheduleButton)
        .addWidget(scheduleBodyText);

    return scheduleBody;
  };


  /**
 * Callback for rendering the addRule card.
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
  
    const saveMoreAction = CardService.newAction()
        .setFunctionName('captureFormData')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const saveMoreButton = CardService.newTextButton()
        .setText('Save Rule and Add More')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(saveMoreAction);
        
    const clearAction = CardService.newAction()
        .setFunctionName('clearProperties')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const clearButton = CardService.newTextButton()
        .setText('Clear all Retention Rules')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(clearAction);

    const optionsSection = CardService.newCardSection()
        .addWidget(search)
        .addWidget(days)
        .addWidget(action);

    const buttonSection = CardService.newCardSection()
        .addWidget(saveMoreButton)
        .addWidget(clearButton)
        .addWidget(buildPreviousAndRootButtonSet());
  
    card.addSection(optionsSection);
    card.addSection(buttonSection);
    return card.build();
  };


  /**
   *  Create a popup message
   * @param {message} - Message from calling funciton
   *  @return {TextButton}
   */
  function notify(message) {
    const notification = CardService.newNotification().setText(message);
    return CardService.newActionResponseBuilder()
        .setNotification(notification)
        .build();
  }

  /**
   *  Pop a card from the stack.
   *  @return {ActionResponse}
   */
   function gotoPreviousCard() {
    var nav = CardService.newNavigation()
            .popCard()
            .updateCard(onHomepage());
    return CardService.newActionResponseBuilder()
        .setNavigation(nav)
        .build();
  }

  /**
   *  Return to the initial add-on card.
   *  @return {ActionResponse}
   */
  function gotoRootCard() {
    var nav = CardService.newNavigation()
            .popToRoot()
            .updateCard(onHomepage());
    
    return CardService.newActionResponseBuilder()
        .setNavigation(nav)
        .build();
  }


    /**
   *  Create a ButtonSet with two buttons: one that backtracks to the
   *  last card and another that returns to the original (root) card.
   *  @return {ButtonSet}
   */
     function buildPreviousAndRootButtonSet() {
        var previousButton = CardService.newTextButton()
            .setText('Back')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(CardService.newAction()
                .setFunctionName('gotoPreviousCard'));
        var toRootButton = CardService.newTextButton()
            .setText('HOME')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(CardService.newAction()
                .setFunctionName('gotoRootCard'));
    
        // Return a new ButtonSet containing these two buttons.
        return CardService.newButtonSet()
            .addButton(previousButton)
            .addButton(toRootButton);
      }

 /**
  * Unused UI card examples
  */     

  /**
   *  Create a button that navigates to the specified child card.
   *  @return {TextButton}
   */
   function createToCardButton(cardName) {
    var button = CardService.newTextButton()
        .setText(cardName)
        .setOnClickAction(action);
    return button;
  }

  