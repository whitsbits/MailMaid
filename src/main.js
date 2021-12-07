/**
 * Global Variables
 */
const EnhancedCacheService = wrap(CacheService.getUserCache());
const cache = EnhancedCacheService;
const card = CardService.newCardBuilder();
const userProperties = PropertiesService.getUserProperties();
const whiteSpace = CardService.newTextParagraph()
          .setText('\n');
const cardSectionDivider = CardService.newDivider();
const inc = 500; // Inbox Message Iteration Increment
let timeOutLimit = 285000; // just under 5  mins in MS
let ttl = 82800; //23 hours in seconds

function initApp() {
    let init = checkInitStatus();
    if (init === false){
      initSchedule();
      initRules();
      initLicense();
      userProperties.setProperties({'initialized':true});
      Logger.log (`${user} - App Initialized` );
    }else{
      if (checkLastRun()) { //clear any "This trigger has been disabled for an unknown reason."
        initSchedule();
      }
      Logger.log (`${user} - App already initialized`);
    }
    return true;
}


//-----------------HOMEPAGE CARD---------------------------//
/**
 * Callback for rendering the main card.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 */
 function onHomepage(e) {
    initApp();
    card.addSection(homepageIntroSection());
    card.addSection(homepageScheduleSection());
    card.addSection(homepageRulesSection());
    card.addSection(homepageLicenseSection());
    card.addSection(disclosuresSection());
    card.setName('homepage')

    return card.build();
  };

  /**
 * Callback for rendering the intro section.
  * @return {CardService.Section} Return the section to build the card.
 */
  function homepageIntroSection() {
    var introText = "MailMaid automatically cleans your email by setting rules that find messages based on <a href=\"https://support.google.com/mail/answer/7190?hl=en\">GMail search criteria</a> and can archive or purge them for you, according to the number of days since the message was received."
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
    var rulesText = `MailMaid is doing these tasks for you: \n\n ${reportRulesText()}`;  
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

  function homepageLicenseSection() {
    if (licenseRead() === false){
      const licenseText = CardService.newTextParagraph()
            .setText (`Enter your license information here`);
      const licenseInput = CardService.newTextInput()
            .setFieldName('number')
            .setValue("")
            .setHint('Paste license key sent to you here');

      const addLicenseDataAction = CardService.newAction()
            .setFunctionName('setLicense')
            .setLoadIndicator(CardService.LoadIndicator.SPINNER);
      const addLicenseDataButton = CardService.newTextButton()
            .setText('Add License Key')
            .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
            .setOnClickAction(addLicenseDataAction);

      const licenseSection = CardService.newCardSection()
            .addWidget(licenseText)
            .addWidget(licenseInput)
            .addWidget(addLicenseDataButton)
        
      return licenseSection;

    }else{
      const licenseNum = userProperties.getProperty("license")
      const licenseText = CardService.newTextParagraph()
      .setText(`License Key: ${licenseNum}`);
      const licenseSection = CardService.newCardSection()
            .addWidget(licenseText);

      return licenseSection;
    }
  }

function disclosuresSection() {
  const disclosureText = `MailMaid's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.`

  const disclosureTextParagraph = CardService.newTextParagraph()
        .setText(disclosureText);

  const disclosuresSection = CardService.newCardSection()
        .addWidget(disclosureTextParagraph);

  return disclosuresSection;
}
//-----------------START RULES CARD---------------------------//
  /**
 * Callback for rendering the rulesManagerCard.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 * Right now requires two virtually duplicate input widgets TODO refactor dupe code
 */

  function rulesManagerCard(e, action, search, days) {
    var rules = getRulesArr();
    if (typeof rules === "string") {
        var selectRulesBodyWidget = CardService.newTextParagraph()
        .setText(rules);
    }else{



    var selectRulesBodyWidget = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setFieldName('editRule')
        .setOnChangeAction(CardService.newAction().setFunctionName('onModeChange'))
        .addItem("Click here to select an existing Rule to edit","rule0", true)

        for (let i = 0; i < rules.length; i++) {
            var ruleItem = rules[i];
            var ruleNum = `rule${i + 1}`;
            var rulePres = `Rule ${i + 1}: ${ruleItem}`
            selectRulesBodyWidget.addItem(rulePres, ruleNum, false);
        }   
    }
    const selectRulesBodyText = CardService.newTextParagraph()
          .setText('<b>Which rule do you want to edit?</b>');

    var rulesManagerSection = CardService.newCardSection()
        .addWidget(selectRulesBodyText)
        .addWidget(selectRulesBodyWidget)
        .addWidget(cardSectionDivider);

  ///------------------START INPUT WIDGET--------------------------------//
  //----------------------Base state widget------------------------------//
  if(e === null || action === undefined || search === undefined || days === undefined){
    const _searchText = CardService.newTextParagraph()
    .setText('<b>Use <a href="https://support.google.com/mail/answer/7190?hl=en">GMail Search String</a> to tell MailMaid which messages need to be removed:</b>')
    
    var _search = CardService.newTextInput()
      .setFieldName('search')
      .setValue("")
      .setHint(`Use standard GMail Query Language`);

    const _daysText = CardService.newTextParagraph()
        .setText('<b>How many days before MailMaid cleans the messages?</b>')

    var _days = CardService.newTextInput()
      .setFieldName('days')
      .setValue("")
      .setHint('Number of days before MailMaid removes this email.');

    const _actionText = CardService.newTextParagraph()
        .setText('<b>What do you want MailMaid to do?</b>')
        
    var _action = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.RADIO_BUTTON)
      .setFieldName('action')
      .addItem('Purge - moves to trash', 'Purge', true)
      .addItem('Archive - removes from inbox', 'Archive', false);

    rulesManagerSection
      .addWidget(_actionText)
      .addWidget(_action)
      .addWidget(cardSectionDivider)
      .addWidget(_searchText)
      .addWidget(_search)
      .addWidget(cardSectionDivider)
      .addWidget(_daysText)
      .addWidget(_days)
      .addWidget(cardSectionDivider)
      .addWidget(ruleButtonsSet());

      card.addSection(rulesManagerSection);
      card.setFixedFooter(navFooter());
      return card.build();

//-----------------------edit rule selected widget--------------------------//
  }else if (action != undefined || search != undefined || days != undefined){
    let ruleNum = cache.get('editRuleNum')
    let editRuleNumData = userProperties.getProperty(ruleNum)
        .replace(/[\[\]"]/g,'');
        //.split(',');
    var editRuleNumText = `You are currently editing ${ruleNum} \n ${editRuleNumData}`
    var editRuleNumWidget = CardService.newTextParagraph()
      .setText(editRuleNumText)    
    
    const _searchText = CardService.newTextParagraph()
    .setText('<b>Use <a href="https://support.google.com/mail/answer/7190?hl=en">GMail Search String</a> to tell MailMaid which messages need to be removed:</b>')
    
    var _search = CardService.newTextInput()
        .setFieldName('search')
        .setValue(search)
        .setHint(`Use standard GMail Query Language`);

    const _daysText = CardService.newTextParagraph()
        .setText('<b>How many days until before MailMaid cleans the messages?</b>')

    var _days = CardService.newTextInput()
        .setFieldName('days')
        .setValue(days)
        .setHint('Number of days before MailMaid removes this email.');

        if (action === 'Purge') {
            var item1 = true
            var item2 = false
        }else if (action === 'Archive'){
            var item2 = true
            var item1 = false
        };
  
    const _actionText = CardService.newTextParagraph()
        .setText('<b>What do you want MailMaid to do?</b>')

    var _action = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setFieldName('action')
        .addItem('Purge - moves to trash', 'Purge', item1)
        .addItem('Archive - removes from inbox', 'Archive', item2);

    const _actionHint = CardService.newTextParagraph()
        .setText('<font color=\"#bcbcbc\">Purge moves to Trash \nArchive removes from Inbox</font>')

    rulesManagerSection
      .addWidget(_actionText)
      .addWidget(_action)
      .addWidget(cardSectionDivider)
      .addWidget(_searchText)
      .addWidget(_search)
      .addWidget(cardSectionDivider)
      .addWidget(_daysText)
      .addWidget(_days)
      .addWidget(cardSectionDivider)
      .addWidget(ruleButtonsSet());
    }

    //-----------------END RULE INPUT WIDGET----------------------------//

    card.addSection(rulesManagerSection);
    card.setFixedFooter(navFooter());
    return card.build();
    }

  /**
 * Callback for rendering the taking user input and returning it
 *  to rebuild the target card with the captured input data.
 * @param {Object} e - Event from add-on server
 * @return {CardService.Card} The card to show to the user.
 * TODO add @param to change the return function
 */
  function onModeChange(e) {
    let ruleNum = (e.formInput.editRule);
    cache.putString('editRuleNum', ruleNum);
    let ruleElementsArr = reportRulesArrElements(ruleNum);
    Logger.log (`${user} - The element array is: ${ruleElementsArr}`);
    var action = ruleElementsArr[0];
    var search = ruleElementsArr[1];
    var days = ruleElementsArr[2];
    Logger.log (`${user} - Returning onModeChange array of:${action}, ${search}, ${days}`)
    return rulesManagerCard(e, action, search, days);
}

    function ruleButtonsSet() {
        let ruleNum = cache.get('editRuleNum')
        if (ruleNum === null){ruleNum='rule0'}
        const saveAction = CardService.newAction()
            .setFunctionName('captureRuleFormData')
            .setLoadIndicator(CardService.LoadIndicator.SPINNER);
        const saveButton = CardService.newTextButton()
            .setText('Save as New Rule')
            .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
            .setOnClickAction(saveAction);

        const replaceAction = CardService.newAction()
            .setFunctionName('captureRuleFormData')
            .setParameters({ruleNum: ruleNum})
            .setLoadIndicator(CardService.LoadIndicator.SPINNER);
        const replaceButton = CardService.newTextButton()
            .setText('Replace Selected Rule')
            .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
            .setOnClickAction(replaceAction);
            
        const clearSelectedAction = CardService.newAction()
            .setFunctionName('clearSelectedRule')
            .setParameters({ruleNum: ruleNum})
            .setLoadIndicator(CardService.LoadIndicator.SPINNER);
        const clearSelectedButton = CardService.newTextButton()
            .setText('Delete Selected Rule')
            .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
            .setOnClickAction(clearSelectedAction);
            
        const clearAllAction = CardService.newAction()
            .setFunctionName('clearAllRules')
            .setLoadIndicator(CardService.LoadIndicator.SPINNER);
        const clearAllButton = CardService.newTextButton()
            .setText('Delete All Rules')
            .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
            .setOnClickAction(clearAllAction);

        const ruleButtonSet = CardService.newButtonSet()
            .addButton(saveButton)
            .addButton(replaceButton)
            .addButton(clearSelectedButton)
            .addButton(clearAllButton);
        
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
    card.setFixedFooter(navFooter());
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
    const scheduleText = `${reportSchedule()}`;
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

    const everyDaysText = CardService.newTextParagraph()
      .setText ('<b>How often do you want MailMaid to clean?</b>');
    
    const everyDays = CardService.newTextInput()
        .setFieldName('everyDays')
        .setValue('1')
        .setHint(`Set the frequency, in number of days (1-30), you want the schedule to run`);

    /*var atHour = CardService.newTimePicker()
    .setTitle('What time of day do you want the process to run?')
    .setFieldName('atHour')
    //.setHint('Set the hour of the day (use whole number 24h time, like 2 for 2AM) for the schedule to run')
    // Set default value as 02:00.
    .setHours(2); */

    const atHourText = CardService.newTextParagraph()
        .setText ('<b>What time of day do you want MailMaid to clean?</b>');

    const atHour = CardService.newTextInput()
        .setFieldName('atHour')
        .setValue('2')
        .setHint('Set the hour of the day for the schedule to run (use whole number 24h time, like 2 for 2AM or 23 for 11PM)');

    const scheduleFieldsSection = CardService.newCardSection()
        .addWidget(everyDaysText)
        .addWidget(everyDays)
        .addWidget(whiteSpace)
        .addWidget(atHourText)
        .addWidget(atHour);

    return scheduleFieldsSection
}

  /**
 * Callback for rendering a pick list of suggested inputs
 * @param {Object} e - Event from add-on server
 * @return {CardService.newSuggestionsResponseBuilder()} The suggestion list to show to the user.
 * Experimental feature This was not working at last attempt.
 */
function suggestionCallback(e) {
  var suggestions = CardService.newSuggestions();
  var numSuggestions = parseInt(e.parameter['numSuggestions']);
  for(var i = 1; i <= numSuggestions; i++) {
    suggestions.addSuggestion(i);
  }
  return CardService.newSuggestionsResponseBuilder()
      .setSuggestions(suggestions)
      .build();
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
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
        .setOnClickAction(saveMoreAction);
        //.setOnClickAction(CardService.newAction().setFunctionName("rebuildScheduleCard"));
        
    const clearAction = CardService.newAction()
        .setFunctionName('clearSchedule')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const clearButton = CardService.newTextButton()
        .setText('Clear the schedule')
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
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
     function navFooter() {
       
        /*var previousButton = CardService.newTextButton()
            .setText('BACK')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(CardService.newAction()
            .setFunctionName('gotoPreviousCard'));
*/
        var toRootButton = CardService.newTextButton()
            .setText('HOME')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(CardService.newAction()
            .setFunctionName('gotoRootCard'));

        // Return a new fixedFooter containing these two buttons.
        var fixedFooter = CardService.newFixedFooter()
          .setPrimaryButton(toRootButton)
          //.setSecondaryButton(previousButton);
        return fixedFooter;
      };
