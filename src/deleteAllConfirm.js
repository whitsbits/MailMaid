//-----------------START DELETE ALL CONFIRMATION CARD---------------------------//
function confirmDeleteAll() {
    const confirmText = 'Are you sure you want to delete all your rules?'
    const confirmMessageText = CardService.newTextParagraph()
    .setText(
        confirmText
    );
    
    const confirmAction = CardService.newAction()
        .setFunctionName('clearAllRules')
        .setLoadIndicator(CardService.LoadIndicator.SPINNER);
    const confirmButton = CardService.newTextButton()
        .setText('YES')
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
        .setOnClickAction(confirmAction);

    const confirmSection = CardService.newCardSection()
        .addWidget(confirmMessageText)
        .addWidget(confirmButton);

    card.addSection(confirmSection);
    card.setFixedFooter(navFooter());

    return card.build();
}
//-----------------END DELETE ALL CONFIRMATION CARD---------------------------//