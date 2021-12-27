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
        .setText('<b>How often do you want MailMaid to clean?</b>');

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
        .setText('<b>What time of day do you want MailMaid to clean?</b>');

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
    for (var i = 1; i <= numSuggestions; i++) {
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