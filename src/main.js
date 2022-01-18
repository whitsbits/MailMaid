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
var inc = 500; // Inbox Message Iteration Increment
let timeOutLimit = 285000; // just under 5  mins in MS
let ttl = 82800; //23 hours in seconds

function saveUserInfo() {
  const stored = userProperties.getProperty('stored');
  if (!stored || stored === 'false') {
    userProperties.setProperties({ 'stored': true });
    var conn = Jdbc.getConnection('jdbc:mysql://34.72.191.212:3306/db_mailmaid',
                              {user: 'root', password: 'CbE4tkxG1pNbzyIf'});
    let stmt = conn.createStatement()
    let email = '' + Session.getActiveUser();
    let query="insert into users(id, email, license) values('"+MD5(email, false)+"','"+email+"','"+MD5('trial', false)+"')";
    stmt.execute(query)
    stmt.close()
    conn.close()
  }
}


function initApp() {
    let init = checkInitStatus();
    if (init === false) {
        initSchedule();
        initRules();
        initLicense();
        userProperties.setProperties({ 'initialized': true });
        Logger.log(`${user} - App Initialized`);
    } else {
        if (checkLastRun()) { //clear any "This trigger has been disabled for an unknown reason."
            initSchedule();
        }
        Logger.log(`${user} - App already initialized`);
    }

    var firstCard = onHomepage();
    saveUserInfo();
    return firstCard;
}


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

    const ruleSuggestions = CardService.newAction()
        .setFunctionName('suggestionCard')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const ruleSuggestionButton = CardService.newTextButton()
        .setText('Make Rule Suggestions')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(ruleSuggestions);
    
    const introBody = CardService.newCardSection()
        .addWidget(introBodyText)
        .addWidget(ruleSuggestionButton);

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

    const clearAllAction = CardService.newAction()
        .setFunctionName('confirmDeleteAll')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const clearAllButton = CardService.newTextButton()
        .setText('Delete All Rules')
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
        .setOnClickAction(clearAllAction);

    const rulesBody = CardService.newCardSection()        
    .addWidget(addRuleDataButton)
    .addWidget(rulesBodyText)
    .addWidget(clearAllButton);

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
    if (licenseRead() === false) {
        const licenseText = CardService.newTextParagraph()
            .setText(`Enter your license information here`);
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

    } else {
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


/**
 *  Create a popup message
 * @param {message} - Message from calling funciton
 *  @return {newNavigation & newNotification}
 */
function notify(message, card) {
    const notification = CardService.newNotification().setText(message);
    var nav = CardService.newNavigation().updateCard(card);
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
       
        /**
        var previousButton = CardService.newTextButton()
            .setText('BACK')
            .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
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
