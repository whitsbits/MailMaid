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
    };
    saveUserInfo();    
    if (checkInitStatus() === false) {
        initSchedule();
        initRules();
        initLicense();
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
    let homepageCardHeader = CardService.newCardHeader()
    .setTitle('Homepage')
    .setImageUrl(
        'https://github.com/slwhitman/files/blob/main/MailMaidLogo(128px).png?raw=true'
    )
    .setImageAltText('MailMaid')
    .setImageStyle(CardService.ImageStyle.SQUARE);

    card.setHeader(homepageCardHeader);
    if (licenseRead() === 'false'){
    card.addSection(homepageLicenseSection());
    }
    card.addSection(actionSection());
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
function actionSection() {
    
    const actionBodyText = CardService.newTextParagraph()
        .setText("<b>Actions</b>");
    
    const ruleSuggestions = CardService.newAction()
        .setFunctionName('suggestionCard')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const ruleSuggestionButton = CardService.newImageButton()
        .setIconUrl(
            'https://github.com/whitsbits/files/blob/main/suggestions(36).png?raw=true'
        )
        .setAltText('Suggestions')
        .setOnClickAction(ruleSuggestions); 
        
    const downloadAction = CardService.newAction()
        .setFunctionName('downloadManagerCard')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const downloadButton = CardService.newImageButton()
        .setIconUrl(
            'https://github.com/whitsbits/files/blob/main/download(36).png?raw=true'
        )
        .setAltText('Download')
        .setOnClickAction(downloadAction);

    const suggestionDecoratedText = CardService.newDecoratedText()
            .setText('<font color="#2772ed"><b>Make New Rule Suggestions</b></font>')
            .setButton(ruleSuggestionButton);

    const downloadDecoratedText = CardService.newDecoratedText()
        .setText('<font color="#2772ed"><b>Download Old Emails</b></font>')
        .setButton(downloadButton);       
    
    const actionBody = CardService.newCardSection()
        .addWidget(actionBodyText)
        .addWidget(suggestionDecoratedText)
        .addWidget(downloadDecoratedText);
        
    return actionBody;
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
    const addRuleDataButton = CardService.newImageButton()
    .setIconUrl(
        'https://github.com/whitsbits/files/blob/main/rules(36).png?raw=true'
    )
    .setAltText('Rules')
        .setOnClickAction(addRuleDataAction);

    const clearAllAction = CardService.newAction()
        .setFunctionName('confirmDeleteAll')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const clearAllButton = CardService.newTextButton()
        .setText('Delete All Rules')
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
        .setOnClickAction(clearAllAction);

    const rulesDecoratedText = CardService.newDecoratedText()
        .setText('<font color="#2772ed"><b>Manage Rules</b></font>')
        .setButton(addRuleDataButton); 
        
    const rulesBody = CardService.newCardSection()        
        .addWidget(rulesDecoratedText)
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
    const changeScheduleButton = CardService.newImageButton()
    .setIconUrl(
        'https://github.com/whitsbits/files/blob/main/schedule(36).png?raw=true'
    )
    .setAltText('Schedule')
        .setOnClickAction(changeScheduleAction);

    const scheduleDecoratedText = CardService.newDecoratedText()
        .setText('<font color="#2772ed"><b>Manage Schedule</b></font>')
        .setButton(changeScheduleButton); 
        
    const scheduleSection = CardService.newCardSection()
        .addWidget(scheduleDecoratedText)
        .addWidget(scheduleReportWidget());

    return scheduleSection;
};

function homepageLicenseSection() {
    var introText = "MailMaid automatically cleans your email by setting rules that find messages based on <a href=\"https://support.google.com/mail/answer/7190?hl=en\">GMail search criteria</a> and can archive or purge them for you, according to the number of days since the message was received."
    const introBodyText = CardService.newTextParagraph()
        .setText(
            introText
        );

    const licenseBodyText = CardService.newTextParagraph()
        .setText('<b>License</b>');

    const upgradeLicenseButton = CardService.newTextButton()
        .setText('UPGRADE')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOpenLink(CardService.newOpenLink()
            .setUrl('https://us-central1-mailamidweb.cloudfunctions.net/getSessionUrl')
            .setOpenAs(CardService.OpenAs.OVERLAY)
            .setOnClose(CardService.OnClose.NOTHING));

    const refreshLicenseAction = CardService.newAction()
        .setFunctionName('refreshLicense')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const refreshLicenseButton = CardService.newTextButton()
        .setText('Refresh')
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
        .setOnClickAction(refreshLicenseAction);

    const licenseButtonGroup = CardService.newButtonSet()
        .addButton(upgradeLicenseButton)
        .addButton(refreshLicenseButton);

        let licenseText = CardService.newTextParagraph()
            .setText(`<b><font color=\"#ff3355\">This is a trial version.</font></b>
\nMailMaid will stop after Rule 1 or after downloading 1 thread. To enable more,
UPGRADE your licesne at <a href="https://mailmaid.co">mailmaid.co</a> 
If you have just purchased a license click REFRESH to apply it.`);

        let licenseSection = CardService.newCardSection()
            .addWidget(licenseBodyText)
            .addWidget(introBodyText)
            .addWidget(licenseText)
            .addWidget(licenseButtonGroup);

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
