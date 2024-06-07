function suggestionCard() {
        let suggestionCardHeader = CardService.newCardHeader()
            .setTitle('Suggestions')
            .setImageUrl(
                'https://github.com/slwhitman/files/blob/main/MailMaidLogo(128px).png?raw=true'
            )
            .setImageAltText('MailMaid')
            .setImageStyle(CardService.ImageStyle.SQUARE);
    
        let cardSection1TextParagraph1 = CardService.newTextParagraph()
            .setText(
                'MailMaid can review your inbox and find frequent senders to make new rules.'
            );
    
        let cardSection1 = CardService.newCardSection()
            .addWidget(cardSection1TextParagraph1);

    
        let cardSection2TextParagraph1 = CardService.newTextParagraph()
            .setText('<b>In what range do you want to look  for suggestions?</b>');
    
        let cardSection2TextParagraph2 = CardService.newTextParagraph()
            .setText(
                'Tell MailMaid the date range where you want to look for suggestions.'
            );
    
        let cardSection2DatePicker1 = CardService.newDatePicker()
            .setFieldName('afterDate')
            .setTitle('Pick an after date')
            .setValueInMsSinceEpoch(1080795600000);
    
        let cardSection2DatePicker2 = CardService.newDatePicker()
            .setFieldName('beforeDate')
            .setTitle('Pick a before date')
            .setValueInMsSinceEpoch(Date.now());
    
        let cardSection2TextParagraph3 = CardService.newTextParagraph()
            .setText(
                'If there are more than 20k messages, MailMaid will stop and send the results.'
            );
    
        let cardSection2 = CardService.newCardSection()
            .addWidget(cardSection2TextParagraph1)
            .addWidget(cardSection2TextParagraph2)
            .addWidget(cardSection2DatePicker1)
            .addWidget(cardSection2DatePicker2)
            .addWidget(cardSection2TextParagraph3);
    
        let cardSection3TextParagraph1 = CardService.newTextParagraph()
            .setText(
                '<b>How many recommendations do you want MailMaid to make?</b>');
    
        let cardSection3TextParagraph2 = CardService.newTextParagraph()
            .setText(
                'MailMaid can give you the top (5,10,15...) results or results greater than number of emails (any sender > 50 messages)'
            );
    
        let cardSection3SelectionInput1 = CardService.newSelectionInput()
            .setFieldName('suggestionResultChoice')
            .setTitle('Choice')
            .setType(CardService.SelectionInputType.RADIO_BUTTON)
            .addItem('Top # of senders by message count', 'Top', true)
            .addItem('Greater than # message count', 'Greater Than', false);
    
        let cardSection3TextInput1 = CardService.newTextInput()
            .setFieldName('numResults')
            .setValue('5')
            .setTitle('# of choice above')
            .setHint('How many suggestions do you want MailMaid to make?')
            .setMultiline(false);

        const suggestionAction = CardService.newAction()
            .setFunctionName('captureSuggestionFormData')
            .setLoadIndicator(CardService.LoadIndicator.SPINNER);
        const changeScheduleButton = CardService.newTextButton()
            .setText('Send Suggestions to my email')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(suggestionAction);

        let cardSection3 = CardService.newCardSection()
            .addWidget(cardSection3TextParagraph1)
            .addWidget(cardSection3TextParagraph2)
            .addWidget(cardSection3SelectionInput1)
            .addWidget(cardSection3TextInput1)
            .addWidget(whiteSpace)
            .addWidget(changeScheduleButton);

        
        card.setFixedFooter(navFooter());
            
        let suggestionCard = card
            .setHeader(suggestionCardHeader)
            .addSection(cardSection1)
            .addSection(cardSection2)
            .addSection(cardSection3);
            
        return suggestionCard.build();
    }