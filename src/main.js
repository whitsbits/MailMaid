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
    const scheduleText = "You are currently running the schedule as:" //TODO 
    const scheduleBodyText = CardService.newTextParagraph()
        .setText(
            scheduleText
        );
    const scheduleBody = CardService.newCardSection()
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



  /**
   *  Create a child card, with buttons leading to each of the other
   *  child cards, and then navigate to it.
   *  @param {Object} e object containing the id of the card to build.
   *  @return {ActionResponse}
   */
  function gotoChildCard(e) {
    var id = parseInt(e.parameters.id);  // Current card ID
    var id2 = (id==3) ? 1 : id + 1;      // 2nd card ID
    var id3 = (id==1) ? 3 : id - 1;      // 3rd card ID
    var title = 'CARD ' + id;

    // Create buttons that go to the other two child cards.
    var buttonSet = CardService.newButtonSet()
      .addButton(createToCardButton(id2))
      .addButton(createToCardButton(id3));

    // Build the child card.
    var card = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle(title))
        .addSection(CardService.newCardSection()
            .addWidget(buttonSet)
            .addWidget(buildPreviousAndRootButtonSet()))
        .build();

    // Create a Navigation object to push the card onto the stack.
    // Return a built ActionResponse that uses the navigation object.
    var nav = CardService.newNavigation().pushCard(card);
    return CardService.newActionResponseBuilder()
        .setNavigation(nav)
        .build();
  }

  