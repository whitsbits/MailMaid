function suggestionCard() {
    let cardHeader1 = CardService.newCardHeader()
        .setTitle('Rule Suggestions')
        .setImageUrl(
            'https://github.com/slwhitman/files/blob/main/MailMaidLogo(128px).png?raw=true'
        )
        .setImageAltText('MailMaid')
        .setImageStyle(CardService.ImageStyle.SQUARE);

    let cardSection1TextParagraph1 = CardService.newTextParagraph()
        .setText(
            'MailMaid can review your inbox and look at frequent senders and make reccomendations for new rules to help keep your inbox manageable.'
        );

    let cardSection1 = CardService.newCardSection()
        .addWidget(cardSection1TextParagraph1);

    let cardSection2Divider1 = CardService.newDivider();

    let cardSection2TextParagraph1 = CardService.newTextParagraph()
        .setText('<b>How far back do you want to look  for suggestions?</b>');

    let cardSection2TextParagraph2 = CardService.newTextParagraph()
        .setText(
            'MailMaid can only look at 20k messages, so if you have a large inbox, tell MailMaid how far back you want to start looking for suggestions.'
        );

    let cardSection2TextInput1 = CardService.newTextInput()
        .setFieldName('lookbackTime')
        .setValue('1y')
        .setTitle('Start looking at message older than:')
        .setHint('Enter number days (d), months (m), or years (y)')
        .setMultiline(false);

    let cardSection2 = CardService.newCardSection()
        .addWidget(cardSection2Divider1)
        .addWidget(cardSection2TextParagraph1)
        .addWidget(cardSection2TextParagraph2)
        .addWidget(cardSection2TextInput1);

    let cardSection3Divider1 = CardService.newDivider();

    let cardSection3TextParagraph1 = CardService.newTextParagraph()
        .setText(
            '<b>How many recommendations do you want MailMaid to make?</b>');

    let cardSection3TextParagraph2 = CardService.newTextParagraph()
        .setText(
            'MailMaid can give you the top (5,10,15, etc) results or results that are greater than a certain number of emails (any sender > 50 messages)'
        );

    let cardSection3SelectionInput1 = CardService.newSelectionInput()
        .setFieldName('select1')
        .setTitle('Choice')
        .setType(CardService.SelectionInputType.RADIO_BUTTON)
        .addItem('Top # of Senders', 'topNum', true)
        .addItem('Greater that # of messages', 'greaterThan', false);

    let cardSection3TextInput1 = CardService.newTextInput()
        .setFieldName('numResults')
        .setValue('5')
        .setTitle('# of choice above')
        .setHint('How many suggestions do you want MailMaid to make?')
        .setMultiline(false);

    let cardSection3 = CardService.newCardSection()
        .addWidget(cardSection3Divider1)
        .addWidget(cardSection3TextParagraph1)
        .addWidget(cardSection3TextParagraph2)
        .addWidget(cardSection3SelectionInput1)
        .addWidget(cardSection3TextInput1);
     

    let suggestionsCard = card
        .setHeader(cardHeader1)
        .addSection(cardSection1)
        .addSection(cardSection2)
        .addSection(cardSection3)
        .setFixedFooter(navFooter());

    return suggestionsCard.build();
    ;
}