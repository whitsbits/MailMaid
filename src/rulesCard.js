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
    } else {



        var selectRulesBodyWidget = CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setFieldName('editRule')
            .setOnChangeAction(CardService.newAction().setFunctionName('onModeChange'))
            .addItem("Click here to select an existing Rule to edit", "ruleX", true)

        for (let i = 0; i < rules.length; i++) {
            var ruleNum = `rule${rules[i][3]}`;
            var rulePres = `Rule ${rules[i][3]}: ${rules[i][0]}, ${rules[i][1]}, ${rules[i][2]}`;
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
    if (e === null || action === undefined || search === undefined || days === undefined) {
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
            .addWidget(newRuleButtonSet());

        card.addSection(rulesManagerSection);
        card.setFixedFooter(navFooter());
        return card.build();

 //-----------------------edit rule selected widget--------------------------//
}else if (action != undefined || search != undefined || days != undefined){
    let ruleNum = cache.get('editRuleNum')
    let editRuleNumData = reportRulesArrElements(ruleNum);
    var editRuleNumText = `<b><font color=\"#ff3355\">You are currently editing Rule #${editRuleNumData[3]}</b></font>\n   Action: ${editRuleNumData[0]}\n   Search: ${editRuleNumData[1]}\n   Days: ${editRuleNumData[2]}`;
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
      .addWidget(editRuleNumWidget)
      .addWidget(_actionText)
      .addWidget(_action)
      .addWidget(_actionHint)
      .addWidget(cardSectionDivider)
      .addWidget(_searchText)
      .addWidget(_search)
      .addWidget(cardSectionDivider)
      .addWidget(_daysText)
      .addWidget(_days)
      .addWidget(cardSectionDivider)
      .addWidget(selectedRuleButtonSet())
      .addWidget(newRuleButtonSet());
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
    try {
        let ruleNum = (e.formInput.editRule);
        Logger.log (`${user} - Getting elements for Rule: ${ruleNum}`)
        cache.putString('editRuleNum', ruleNum);
        let ruleElementsArr = reportRulesArrElements(ruleNum);
        Logger.log(`${user} - The element array is: ${ruleElementsArr}`);
        var action = ruleElementsArr[0];
        var search = ruleElementsArr[1];
        var days = ruleElementsArr[2];
        Logger.log(`${user} - Returning onModeChange array of:${action}, ${search}, ${days}`)
        return rulesManagerCard(e, action, search, days);
        }
    catch(e) {
        Logger.log(`${user} - onModeChange failed on processing ${ruleNum}: ${e.message}`);
    }
}

function selectedRuleButtonSet() {
    let ruleNum = cache.get('editRuleNum');
    if (ruleNum === null){ruleNum='ruleX'};

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

    const selectedRuleButtonSet = CardService.newButtonSet()
    .addButton(replaceButton)
    .addButton(clearSelectedButton);
        
    return selectedRuleButtonSet;
    }

    function newRuleButtonSet() {
        const previewAction = CardService.newAction()
            .setFunctionName('buildSearchURL')
            .setLoadIndicator(CardService.LoadIndicator.SPINNER);
        const previewButton = CardService.newTextButton()
            .setText('Preview Rule')
            .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
            .setOnClickAction(previewAction);

        const saveAction = CardService.newAction()
            .setFunctionName('captureRuleFormData')
            .setLoadIndicator(CardService.LoadIndicator.SPINNER);
        const saveButton = CardService.newTextButton()
            .setText('Save as New Rule')
            .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
            .setOnClickAction(saveAction);

        const newRuleButtonSet = CardService.newButtonSet()
            .addButton(previewButton)
            .addButton(saveButton);
        
    return newRuleButtonSet;
    } 

//-----------------END RULES CARD---------------------------//
