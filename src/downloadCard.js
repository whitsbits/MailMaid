//-----------------START DOWNLOAD CARD---------------------------//
/**
* Callback for rendering the downloadManagerCard.
* @param {Object} e - Event from add-on server
* @return {CardService.Card} The card to show to the user.
*/

function downloadManagerCard(e) {

    let downloadCardHeader = CardService.newCardHeader()
        .setTitle('Download')
        .setImageUrl(
            'https://github.com/slwhitman/files/blob/main/MailMaidLogo(128px).png?raw=true'
        )
        .setImageAltText('MailMaid')
        .setImageStyle(CardService.ImageStyle.SQUARE);

    var downloadManagerSection = CardService.newCardSection();

    ///------------------START INPUT WIDGET--------------------------------//
    //-----------------------contextual widget--------------------------//
    const _searchText = CardService.newTextParagraph()
        .setText('<b>Use <a href="https://support.google.com/mail/answer/7190?hl=en">GMail Search String</a> to tell MailMaid which messages need to be Downloaded:</b>')
    
    let searchValue =""
    if (e.formInput.search != null){
        searchValue=e.formInput.search;
    }
    var _search = CardService.newTextInput()
        .setFieldName('search')
        .setValue(searchValue)
        .setHint(`Use standard GMail Query Language`);

    const _downloadText = CardService.newTextParagraph()
        .setText('<b>Do you want to just Download or Dowload and Purge?</b>')

    var _downloadAction = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setFieldName('downloadAction')
        .addItem('Download', 'Download', true)
        .addItem('Download & Purge', 'DownloadPurge', false);

    const _downloadActionHint = CardService.newTextParagraph()
        .setText('<font color=\"#bcbcbc\">Download & Purge moves to Trash \nDownload keeps message in your Inbox</font>')

    const _fileTypeText = CardService.newTextParagraph()
        .setText('<b>Do you want to save as text only, html, or message files?</b>')


    if (e.formInput.fileTypeAction === ".eml") {

        var _fileTypeAction = CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.RADIO_BUTTON)
            .setFieldName('fileTypeAction')
            .setOnChangeAction(CardService.newAction().setFunctionName('downloadModeChange'))
            .addItem('Text Only (.txt)', '.txt', false)
            .addItem('HTML (.html)', '.html', false)
            .addItem('Message (.eml)', '.eml', true);

        var _saveFileText = CardService.newTextParagraph()
            .setText('<b>.eml files only support one file per message</b>')

        var _saveFileAction = CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.RADIO_BUTTON)
            .setFieldName('saveFile')
            .addItem('Individual Message per file', 'messageFile', true);

    } else if (e.formInput.fileTypeAction === ".html"){
        var _fileTypeAction = CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.RADIO_BUTTON)
            .setFieldName('fileTypeAction')
            .setOnChangeAction(CardService.newAction().setFunctionName('downloadModeChange'))
            .addItem('Text Only (.txt)', '.txt', false)
            .addItem('HTML (.html)', '.html', true)
            .addItem('Message (.eml)', '.eml', false);

        var _saveFileText = CardService.newTextParagraph()
            .setText('<b>How do you want MailMaid to save the messages into a file?</b>')

        var _saveFileAction = CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.RADIO_BUTTON)
            .setFieldName('saveFile')
            .addItem('Individual Message per file', 'messageFile', true)
            .addItem('Individual Thread per file', 'threadFile', false)
            .addItem('All email in one file', 'oneFile', false);
    } else {
        var _fileTypeAction = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setFieldName('fileTypeAction')
        .setOnChangeAction(CardService.newAction().setFunctionName('downloadModeChange'))
        .addItem('Text Only (.txt)', '.txt', true)
        .addItem('HTML (.html)', '.html', false)
        .addItem('Message (.eml)', '.eml', false);

    var _saveFileText = CardService.newTextParagraph()
        .setText('<b>How do you want MailMaid to save the messages into a file?</b>')

    var _saveFileAction = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .setFieldName('saveFile')
        .addItem('Individual Message per file', 'messageFile', true)
        .addItem('Individual Thread per file', 'threadFile', false)
        .addItem('All email in one file', 'oneFile', false);
    }

    let DownloadAtchControl = CardService.newSwitch()
        .setControlType(CardService.SwitchControlType.SWITCH)
        .setFieldName('atchDownload')
        .setValue(true)
        .setSelected(false);

    let DownloadAtchSwitch = CardService.newDecoratedText()
        .setTopLabel('Download Attachment to Drive')
        .setText('Include Attachments')
        .setSwitchControl(DownloadAtchControl);

    let parseReplyControl = CardService.newSwitch()
        .setControlType(CardService.SwitchControlType.SWITCH)
        .setFieldName('parseReply')
        .setValue(true)
        .setSelected(true);

    let parseReplySwitch = CardService.newDecoratedText()
        .setTopLabel('Removed quoted reply text')
        .setText('Remove Replies')
        .setSwitchControl(parseReplyControl);

    downloadManagerSection
        .addWidget(_searchText)
        .addWidget(_search)
        .addWidget(cardSectionDivider)
        .addWidget(_downloadText)
        .addWidget(_downloadAction)
        .addWidget(_downloadActionHint)
        .addWidget(cardSectionDivider)
        .addWidget(_fileTypeText)
        .addWidget(_fileTypeAction)
        .addWidget(cardSectionDivider)
        .addWidget(_saveFileText)
        .addWidget(_saveFileAction)
        .addWidget(cardSectionDivider)
        .addWidget(DownloadAtchSwitch)
        .addWidget(parseReplySwitch)
        .addWidget(downloadButtonSet());

    card.setHeader(downloadCardHeader);
    card.addSection(downloadManagerSection);
    card.setFixedFooter(navFooter());
    return card.build();
}

//-----------------END DOWNLAOD INPUT WIDGET----------------------------//

/**
* Callback for rendering the taking user input and returning it
*  to rebuild the target card with the captured input data.
* @param {Object} e - Event from add-on server
* @return {CardService.Card} The card to show to the user.
* TODO add @param to change the return function
*/
function downloadModeChange(e) {
    try {
        let fileTypeAction = (e.formInput.fileTypeAction);
        Logger.log(`${user} - Returning dowloandModeChange of:${fileTypeAction}`)
        return downloadManagerCard(e, fileTypeAction);
    }
    catch (e) {
        Logger.log(`${user} - downloadModeChange failed on processing download modeChange: ${e.message}`);
    }
};

function downloadButtonSet() {
    const previewAction = CardService.newAction()
        .setFunctionName('buildDownloadURL')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const previewButton = CardService.newTextButton()
        .setText('Preview Download')
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
        .setOnClickAction(previewAction);

    const downloadAction = CardService.newAction()
        .setFunctionName('captureDownloadFormData')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const downloadButton = CardService.newTextButton()
        .setText('Download Now')
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
        .setOnClickAction(downloadAction);

    const downloadButtonSet = CardService.newButtonSet()
        .addButton(previewButton)
        .addButton(downloadButton);

    return downloadButtonSet;
}

//-----------------END DOWNLAOD CARD---------------------------//
