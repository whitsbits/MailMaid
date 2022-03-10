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


function initApp() {
    var authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
    if (authInfo.getAuthorizationStatus() ==
    ScriptApp.AuthorizationStatus.REQUIRED) {
        Logger.log(`${user} - Missing required scope authorizations`)
    }else{
        Logger.log(`${user} - Required scope authorizations present`)
    }    
    if (checkInitStatus() === false) {
        initSchedule();
        initRules();
        initLicense();
        saveUserInfo();
        setTrigger('checkTrigger', 1, 1);
        userProperties.setProperties({ 'initialized': true });
        Logger.log(`${user} - App Initialized`);
    } else {
        if (checkLastRun()) { //clear any "This trigger has been disabled for an unknown reason."
            initSchedule();
            if(!triggerActive('checkTrigger')){
                setTrigger('checkTrigger', 1, 1);
            } 
        }
        Logger.log(`${user} - App already initialized`);
    }

    var firstCard = onHomepage();
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
    card.addSection(homepageLicenseSection());
    card.addSection(downloadSection());
    card.addSection(homepageScheduleSection());
    card.addSection(homepageRulesSection());
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
* Callback for rendering the intro section.
* @return {CardService.Section} Return the section to build the card.
*/
function downloadSection() {
    var downloadText = "Use <a href=\"https://support.google.com/mail/answer/7190?hl=en\">GMail search criteria</a> to tell MailMaid which messages need to be downloaded and removed"
    const dowloadBodyText = CardService.newTextParagraph()
        .setText(
            downloadText
        );
    
    const ruleSuggestions = CardService.newAction()
        .setFunctionName('suggestionCard')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const ruleSuggestionButton = CardService.newTextButton()
        .setText('Make Suggestions')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(ruleSuggestions); 
        
    const downloadAction = CardService.newAction()
        .setFunctionName('downloadManagerCard')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const downloadButton = CardService.newTextButton()
        .setText('Download EMails')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(downloadAction);
    
    const downloadBody = CardService.newCardSection()
        //.addWidget(dowloadBodyText)
        .addWidget(ruleSuggestionButton)
        .addWidget(downloadButton);
        

    return downloadBody;
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

    let licenseText = CardService.newTextParagraph()
    .setText(`Initializing License`);

    const upgradeLicenseButton = CardService.newTextButton()
        .setText('UPGRADE License')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOpenLink(CardService.newOpenLink()
            .setUrl('https://checkout.stripe.com/pay/cs_live_a1EH8BAvQ7NsZ9rNbIVXyPjn3pkN48X4syc4NIguB6u8jgGKdlCz149rAN#fidkdWxOYHwnPyd1blppbHNgWjA0T252NVJNSDRNfTQ8TGxnV2h9XUd3TH9Bdlx2cUoyb2NXQUFmVkQxbzRfc1R1fHVNdVRRZHNQRGRNRnxEXE9QdUJ9QUxiR3RxbGlEbkZrSUpDcERVMnN2NTVcf0g9cmZiMycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl')
            .setOpenAs(CardService.OpenAs.OVERLAY)
            .setOnClose(CardService.OnClose.NOTHING));

    const refreshLicenseAction = CardService.newAction()
        .setFunctionName('refreshLicense')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const refreshLicenseButton = CardService.newTextButton()
        .setText('Refresh License')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(refreshLicenseAction);

    let licenseSection = CardService.newCardSection()
        .addWidget(licenseText)
    
    if (licenseRead() === 'false') {
        licenseText = CardService.newTextParagraph()
            .setText(`<b><font color=\"#ff3355\">This is a trial version.</font></b>\nMailMaid will stop after Rule 1 or\nafter downloading 1 thread.\n\nTo enable more, please purchase a licesne at <a href="https://mailmaid.co">mailmaid.co</a>`);
        licenseSection = CardService.newCardSection()
            .addWidget(licenseText)
            .addWidget(upgradeLicenseButton)
            .addWidget(refreshLicenseButton);

    }else if (licenseRead() === 'true') {
        licenseText = CardService.newTextParagraph()
            .setText(`Product is fully licensed.`);

        licenseSection = CardService.newCardSection()
            .addWidget(licenseText);
    };        

        return licenseSection;
};

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
