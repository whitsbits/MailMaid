/**
 * Global Variables
 */

const card = CardService.newCardBuilder();
const userProperties = PropertiesService.getUserProperties();
const cache = CacheService.getUserCache();


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
    var rulesText = `Your current rules are: \n\n ${reportRulesText()}`;  
    const rulesBodyText = CardService.newTextParagraph()
        .setText(
            rulesText
        );  
    const addRuleDataAction = CardService.newAction()
        .setFunctionName('addRuleData')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const addRuleDataButton = CardService.newTextButton()
        .setText('Manage Rules')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(addRuleDataAction);

    const rulesBody = CardService.newCardSection()        
    .addWidget(addRuleDataButton)
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
        .setFunctionName('addSchedule')
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
  function addRuleData(e) {   
        card.addSection(selectRulesArr());
        card.addSection(rulesInputForm());
        card.addSection(ruleButtons());
    return card.build();
  };

    function ruleButtons() {
        const saveAction = CardService.newAction()
            .setFunctionName('captureRuleFormData')
            .setLoadIndicator(CardService.LoadIndicator.SPINNER);
        const saveButton = CardService.newTextButton()
            .setText('Save New Rule')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(saveAction);
            
        const clearAction = CardService.newAction()
            .setFunctionName('clearRules')
            .setLoadIndicator(CardService.LoadIndicator.SPINNER);
        const clearButton = CardService.newTextButton()
            .setText('Clear All Rules')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(clearAction);

        const ruleButtonSet = CardService.newButtonSet()
            .addButton(saveButton)
            .addButton(clearButton);

        const ruleButtonSection = CardService.newCardSection()
            .addWidget(ruleButtonSet);
        
    return ruleButtonSection
    } 

  function rulesInputForm(search, days, action) {
    const _search = CardService.newTextInput().setTitle('GMail Search String')
        .setFieldName('search')
        .setValue("search")
        .setHint(`Use standard GMail Query Language`);

    const _days = CardService.newTextInput().setTitle('How many days until action')
        .setFieldName('days')
        .setValue("days")
        .setHint('How many days before the retention manager processes the action.');
/*
    if (action = 'purge') {
        var item1 = true
    }else if (action = 'archive'){
        var item2 = true
    }; */
    const _action = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle('Which action do you want the retention manager to take?')
        .setFieldName('action')
        .addItem('Purge', 'purge', true)
        .addItem('Archive', 'archive', false);
    
    const optionsSection = CardService.newCardSection()
        .addWidget(_search)
        .addWidget(_days)
        .addWidget(_action);

    return optionsSection
  }

  function selectRulesArr() {
    var rules = getRulesArr();
    if ((rules === null || rules.length === 0)) {
        var selectRulesBody = CardService.newTextParagraph()
        .setText(rules);
    }//fix the if it is not a array issue    
    var selectRulesBody = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setTitle('Which rule do you want to edit?')
    .setFieldName('editRule')

    for (let i = 0; i < rules.length; i++) {
        var ruleItem = rules[i];
        var ruleNum = `rule${i}`;
        var rulePres = `Rule ${i + 1}: ${ruleItem}`
        var action = rules[i][0];
        var search = rules[i][1];
        var days = rules[i][2];
        selectRulesBody.addItem(rulePres, ruleNum, false);
    }   

    const selectRulesBodySection = CardService.newCardSection()
        .addWidget(selectRulesBody);
    return selectRulesBodySection
  }

  function onModeChange(e) {
    console.log(e.formInput.action)
}

  function selectRulesReportArr() {
    var rules = reportRulesArr();
    const selectRulesBody = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setTitle('Which rule do you want to edit?')
    .setFieldName('editRule')

    for (let i = 0; i < rules.length; i++) {
        var ruleItem = rules[i];
        var ruleNum = `rule${i}`;
        selectRulesBody.addItem(ruleItem, ruleNum, false);
    }   

    const selectRulesBodySection = CardService.newCardSection()
        .addWidget(selectRulesBody);
    return selectRulesBodySection
  }

  function selectRulesReportText() {
    var rules = reportRulesText();
    const selectRulesBody = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setTitle('Which rule do you want to edit?')
    .setFieldName('editRule')

    for (let i = 0; i < rules.length; i++) {
        var ruleItem = rules[i];
        var ruleNum = `rule${i}`;
        selectRulesBody.addItem(ruleItem, ruleNum, false);
    }   //This is currently parsing the individual letters

    const selectRulesBodySection = CardService.newCardSection()
        .addWidget(selectRulesBody);
    return selectRulesBodySection
  }

/**
 * Callback for rendering the addSchedule card.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 */
 function addSchedule(e) {
    const card = CardService.newCardBuilder();
  
    const everyDays = CardService.newTextInput().setTitle('Run every')
        .setFieldName('everyDays')
        .setValue('1')
        .setHint(`Set how frequently you want the schedule to run`);
  
    const atHour = CardService.newTextInput().setTitle('What time of day?')
        .setFieldName('atHour')
        .setValue('2')
        .setHint('Set the hour of the day (use 24h time) for the schedule to run');
  
    const saveMoreAction = CardService.newAction()
        .setFunctionName('captureScheduleFormData')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const saveMoreButton = CardService.newTextButton()
        .setText('Save Schedule')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(saveMoreAction);
        
    const clearAction = CardService.newAction()
        .setFunctionName('clearSchedule')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const clearButton = CardService.newTextButton()
        .setText('Clear the schedule')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(clearAction);

    const optionsSection = CardService.newCardSection()
        .addWidget(everyDays)
        .addWidget(atHour);

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
   *  Rebuild current card from the stack.
   *  @return {ActionResponse}
   */
   function refreshCard(cardName) {
    var nav = CardService.newNavigation()
            .updateCard([cardName]());
    return CardService.newActionResponseBuilder()
        .setNavigation(nav)
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

  