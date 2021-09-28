/**
 * Global Variables
 */

const card = CardService.newCardBuilder();
const userProperties = PropertiesService.getUserProperties();
const cache = CacheService.getUserCache();
const inc = 500; // InBox Iteration Increment

//-----------------HOMEPAGE CARD---------------------------//
/**
 * Callback for rendering the main card.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 */
 function onHomepage(e) {

    card.addSection(homepageIntroSection());
    card.addSection(homepageScheduleSection());
    card.addSection(homepageRulesSection());
    card.setName('homepage')

    return card.build();
  };

  /**
 * Callback for rendering the intro section.
  * @return {CardService.Section} Return the section to build the card.
 */
  function homepageIntroSection() {
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
  function homepageRulesSection() {
    var rulesText = `Your current rules are: \n\n ${reportRulesText()}`;  
    const rulesBodyText = CardService.newTextParagraph()
        .setText(
            rulesText
        );  
    const addRuleDataAction = CardService.newAction()
        .setFunctionName('rulesManagerCard')
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
  function homepageScheduleSection() {
    const changeScheduleAction = CardService.newAction()
        .setFunctionName('scheduleCard')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const changeScheduleButton = CardService.newTextButton()
        .setText('Manage Schedule')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(changeScheduleAction);    
    
    const scheduleSection = CardService.newCardSection()
        .addWidget(changeScheduleButton)
        .addWidget(scheduleReportWidget());

    return scheduleSection;
  };

//-----------------START RULES CARD---------------------------//
  /**
 * Callback for rendering therulesManagerCard.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 */

  function rulesManagerCard(e, action, search, days) {

    var rules = getRulesArr();
    if (typeof rules === "string") {
        var selectRulesBodyWidget = CardService.newTextParagraph()
        .setText(rules);
    }else{    
    var selectRulesBodyWidget = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle('Which rule do you want to edit?')
        .setFieldName('editRule')
        .setOnChangeAction(CardService.newAction().setFunctionName('onModeChange'))
        .addItem("Click to select a Rule to edit","rule0", true)

        for (let i = 0; i < rules.length; i++) {
            var ruleItem = rules[i];
            var ruleNum = `rule${i + 1}`;
            var rulePres = `Rule ${i + 1}: ${ruleItem}`
            selectRulesBodyWidget.addItem(rulePres, ruleNum, false);
        }   
    }

    var rulesManagerSection = CardService.newCardSection();
    rulesManagerSection.addWidget(selectRulesBodyWidget);

  ///------------------START INPUT WIDGET--------------------------------
  if(action === undefined || search === undefined || days === undefined){
  var _search = CardService.newTextInput().setTitle('GMail Search String')
  .setFieldName('search')
  .setValue("categories:promotions")
  .setHint(`Use standard GMail Query Language`);

var _days = CardService.newTextInput().setTitle('How many days until action')
  .setFieldName('days')
  .setValue("30")
  .setHint('How many days before the retention manager processes the action.');

var _action = CardService.newSelectionInput()
  .setType(CardService.SelectionInputType.RADIO_BUTTON)
  .setTitle('Which action do you want the retention manager to take?')
  .setFieldName('action')
  .addItem('Purge', 'purge', true)
  .addItem('Archive', 'archive', false);

rulesManagerSection
  .addWidget(_action)
  .addWidget(_search)
  .addWidget(_days)
  .addWidget(ruleButtonsSet());

  card.addSection(rulesManagerSection);
  card.addSection(navButtonSet());
  return card.build();

  }else if (action != undefined || search != undefined || days != undefined){
    var _search = CardService.newTextInput().setTitle('GMail Search String')
        .setFieldName('search')
        .setValue(search)
        .setHint(`Use standard GMail Query Language`);

    var _days = CardService.newTextInput().setTitle('How many days until action')
        .setFieldName('days')
        .setValue(days)
        .setHint('How many days before the retention manager processes the action.');
      
      var item1 = null;
      var item2 = null;

        if (action === 'purge') {
            item1 = true
            item2 = false
        }else if (action === 'archive'){
            item2 = true
            item1 = false
        };
  
    var _action = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setTitle('Which action do you want the retention manager to take?')
        .setFieldName('action')
        .addItem('Purge', 'purge', item1)
        .addItem('Archive', 'archive', item2);

    rulesManagerSection
        .addWidget(_action)
        .addWidget(_search)
        .addWidget(_days)
        .addWidget(ruleButtonsSet());
    }
    card.addSection(rulesManagerSection);
    card.addSection(navButtonSet());
    return card.build();
    }

  function onModeChange(e) {
    let ruleNum = (e.formInput.editRule);
    let ruleElementsArr = reportRulesArrElements(ruleNum);
    Logger.log (`The element array is: ${ruleElementsArr}`);
    var action = ruleElementsArr[0];
    var search = ruleElementsArr[1];
    var days = ruleElementsArr[2];
    Logger.log (`Returning onModeChange array of:${action}, ${search}, ${days}`)
    return rulesManagerCard(e, action, search, days);
}

    function ruleButtonsSet() {
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
        
    return ruleButtonSet
    } 

//-----------------END RULES CARD---------------------------//


//-----------------SCHEDULE CARD---------------------------//

/**
 * Callback for rendering the addSchedule card.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 */
 function scheduleCard(e) {
    card.addSection(scheduleReportSection())
    card.addSection(scheduleFieldsSection());
    card.addSection(scheduleButtonsSection());
    card.addSection(navButtonSet());
    card.setName('schedule')
    return card.build();
  };

/**
 * Callback for rendering the schedule report section.
 * @return {CardService.Section} The card to show to the user.
 */
function scheduleReportSection() {
    const scheduleReportSection = CardService.newCardSection()
        .addWidget(scheduleReportWidget());
    return scheduleReportSection;
}  

/**
 * Callback for rendering the schedule report widget.
 * @return {CardService.Widget} The card to show to the user.
 */
  
function scheduleReportWidget() {
    const scheduleText = `Your current schedule is: \n\n ${reportSchedule()}`;
    const scheduleReportWidget = CardService.newTextParagraph()
        .setText(
            scheduleText
        );

    return scheduleReportWidget
}

/**
 * Callback for rendering the schedule fields section
 * @return {CardService.Section} The card to show to the user.
 */
function scheduleFieldsSection() {
    const everyDays = CardService.newTextInput().setTitle('Run every')
        .setFieldName('everyDays')
        .setValue('1')
        .setHint(`Set how frequently you want the schedule to run`);

    const atHour = CardService.newTextInput().setTitle('What time of day?')
        .setFieldName('atHour')
        .setValue('2')
        .setHint('Set the hour of the day (use 24h time) for the schedule to run');

    const scheduleFieldsSection = CardService.newCardSection()
        .addWidget(everyDays)
        .addWidget(atHour);

    return scheduleFieldsSection
}

/**
 * Callback for rendering the schedule buttons section
 * @return {CardService.Section} The card to show to the user.
 */

function scheduleButtonsSection() {

    const saveMoreAction = CardService.newAction()
        .setFunctionName('captureScheduleFormData')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const saveMoreButton = CardService.newTextButton()
        .setText('Save Schedule')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(saveMoreAction);
        //.setOnClickAction(CardService.newAction().setFunctionName("rebuildScheduleCard"));
        
    const clearAction = CardService.newAction()
        .setFunctionName('clearSchedule')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const clearButton = CardService.newTextButton()
        .setText('Clear the schedule')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(clearAction);
        //.setOnClickAction(CardService.newAction().setFunctionName("rebuildScheduleCard"));

    const scheduleButtonsSection = CardService.newCardSection()
        .addWidget(saveMoreButton)
        .addWidget(clearButton)

    return scheduleButtonsSection
}

//-----------------END SCHEDULE CARD---------------------------//

  /**
   *  Create a popup message
   * @param {message} - Message from calling funciton
   *  @return {newNavigation & newNotification}
   */
   function notify(message, card) {
    const notification = CardService.newNotification().setText(message);
    var nav= CardService.newNavigation().updateCard(card);
    return CardService.newActionResponseBuilder()
        .setNavigation(nav)
        .setNotification(notification)
        .setStateChanged(true)
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
   *  Return to the initial homepage add-on card.
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
     function navButtonSet() {
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
        var navButtonSet = CardService.newButtonSet()
            .addButton(previousButton)
            .addButton(toRootButton);
        // Return a new ButtonSet containing these two buttons.
        var navButtonSection = CardService.newCardSection().addWidget(navButtonSet);
        return navButtonSection;
      };

      



  /** NOT USED, SAVE FOR FUTURE USE 
   * 
   * 
   *   function selectRulesReportText() {
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


  */