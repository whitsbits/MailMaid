function callCountSenders() {
  countSenders(searchDateConverter(1638316800000), searchDateConverter(Date.now()),5,null)
}

function countSenders(afterDate, beforeDate, numResults, suggestionResultChoice) {
  const scriptStart = new Date();
  let loopBreak = 0;
  const query  = suggestionSearchQueryBuilder(afterDate, beforeDate);
  /**  
* check to see if the app is woken from sleep and get last count value  
* and if count has been cached use value to resume count of the process
*/

  var searchBatchStart = cache.getNumber('sendersCache');
  if (searchBatchStart === null) {
    searchBatchStart = 0;
  };

  let sender_array = cache.getObject('senderArr');
  if (sender_array === null) {
    sender_array = [];
  };
  let uA = cache.getObject('senderuA')
  if (uA === null) {
    uA = [];
  };
  let cObj = cache.getObject('sendercObj');
  if (cObj === null) {
    cObj = {};
  };

  searchloop:
  do {
    let threadsCached = cache.getNumber('senderThreadsCache');
    let threadsCount = 0;
    if (threadsCached !== null) {
      threadsCount = threadsCached;
    };

    var threads = GmailApp.search(query, searchBatchStart, inc);
    let batch = (`${searchBatchStart} to ${searchBatchStart + threads.length}`);
    Logger.log(`${user} - Processing batch ${batch} starting at thread ${threadsCount}.`);
    if (threads.length === 0) {
      break searchloop;
    }

    for (var i = threadsCount; i < threads.length; i++) {
      var message = threads[i].getMessages();
      var sender = message[0].getFrom();
      if (uA.indexOf(sender) == -1) {
        uA.push(sender);
        sender_array.push([sender]);
        cObj[sender] = 1;
      } else {
        cObj[sender] += 1;
      }
      if (isTimeUp_(scriptStart, timeOutLimit)) {
        /** * When script runs close to the 5 min timeout limit take the count, 
         * cache it and set a trigger to researt after 2 mins */
        Logger.log(`${user} - Timed out in Thread ${i}, Batch start ${searchBatchStart}. Values put in cache`);
        cache.putNumber('sendersCache', searchBatchStart, ttl); // cache for 23 hours
        cache.putNumber('senderThreadsCache', i, ttl);
        cache.putObject('senderArr', sender_array, ttl); // cache for 23 hours
        cache.putObject('senderuA', uA, ttl)
        cache.putObject('sendercObj', cObj, ttl)
        setMoreTrigger('countMoreSenders'); //set trigger to restart script
        loopBreak = 1;
        break searchloop;
      }

    }
    clearCache('senderThreadsCache');
    searchBatchStart += inc;
    if (searchBatchStart === 19500) { //Limit to less than max GMail quota of read/writes at 20k per day
      inc = 499; // reduce the increment to go to 19,999
    }else if ( searchBatchStart === 19999) { //then kill the loop
      loopBreak = 1;
      break searchloop;
    };
  } while (threads.length > 0);

  if (loopBreak != 1) {

    sender_array.forEach(function (r) { // add the message counts to each sender in the the sender_array
      r.splice(1, 0, cObj[r[0]]);
    });

    const index = sender_array.indexOf(user); //remove the  current user as a suggestion target
      if (index > -1) {
        sender_array.splice(index, 1);
    }

    var topValues = []; // set an array for the top values to send the user
    if (suggestionResultChoice === 'topMessage'){
      topValues = sender_array.sort(decendingSort).slice(0, numResults);
    }else if (suggestionResultChoice === 'greaterThanMsg'){
      sender_array.forEach(function(r){
        if(r[1] >= numResults){
          topValues.push([r[0],r[1]]);
        }
      })
    }

    emailSendersCount(topValues);
    clearCache('sendersCache');
    clearCache('senderArr');
    clearCache('senderuA');
    clearCache('sendercObj');
  }
}

function emailSendersCount(topValues) {
  Logger.log(`${user} - Returning top values of: ${topValues}`);
  sendReportEmail('src/senders-email.html', topValues);
}

function suggestionSearchQueryBuilder(afterDate, beforeDate) {
  let query = '';
    query = ('-in:spam' + " " + "after:" + afterDate + " before:" + beforeDate);
  Logger.log (`${user} - Returning suggestion search query of: ${query}`)  
  return query
}



function getSenderArr(){
  senderArr =[ [ 'Stewart Whitman <stewart.l.whitman@gmail.com>', 86 ],
  [ 'LinkedIn Job Alerts <jobalerts-noreply@linkedin.com>', 85 ],
  [ 'The Boston Globe <newsletters@email.bostonglobe.com>', 77 ],
  [ 'The New York Times <nytdirect@nytimes.com>', 71 ],
  [ 'The Boston Globe <newsletters@bostonglobe.com>', 67 ],
  [ 'The Athletic Daily <TheAthletic@e1.theathletic.com>', 64 ],
  [ 'American Express <americanexpress@member.americanexpress.com>',
    50 ],
  [ 'Mint <mint@em1.mint.intuit.com>', 42 ],
  [ 'Newrez <hello@eml.newrez.com>', 40 ],
  [ 'Mint <team@mint.com>', 39 ],
  [ 'New York State Department of Environmental Conservation <nysdec@public.govdelivery.com>',
    39 ],
  [ 'Reddit <noreply@redditmail.com>', 37 ],
  [ 'Venmo <venmo@venmo.com>', 37 ],
  [ 'Katonah-Lewisboro School District <alerts@klschools.org>',
    37 ],
  [ 'The Washington Post <email@washingtonpost.com>', 35 ],
  [ 'American Express <AmericanExpress@welcome.aexp.com>', 33 ],
  [ 'Microsoft Family Safety <familysafety@microsoft.com>', 33 ],
  [ 'Jamer Breene <jamerb3@gmail.com>', 33 ],
  [ 'Japanese 3-0 <notifications@instructure.com>', 30 ],
  [ 'Chase <no.reply.alerts@chase.com>', 28 ],
  [ 'The Economist Espresso <espresso@e.economist.com>', 26 ],
  [ 'William Steers <bill.steers@outlook.com>', 25 ],
  [ '"Darin D\'Ambrosio" <Notification@leagueathletics.com>', 25 ],
  [ 'Marriott Bonvoy <marriottbonvoy@email-marriott.com>', 24 ],
  [ 'Chase <no-reply@alertsp.chase.com>', 23 ],
  [ 'The Economist <noreply@e.economist.com>', 23 ],
  [ 'Fundrise <investments@fundrise.com>', 23 ],
  [ 'Allison Nied <allisonnied@gmail.com>', 23 ],
  [ '"Cornell University, Division of Alumni Affairs and Development" <alumniaffairs@cornell.edu>',
    22 ],
  [ 'The Economist today <newsletters@e.economist.com>', 21 ],
  [ 'Notification <Notification@leagueathletics.com>', 21 ],
  [ 'marissa sandoval <msandoval2121@gmail.com>', 21 ],
  [ 'Fidelity Investments <Fidelity.Alerts@fidelity.com>', 21 ],
  [ 'The Windward School <communications@thewindwardschool.org>',
    20 ],
  [ 'English 11-1 <notifications@instructure.com>', 19 ],
  [ 'Apple <no_reply@email.apple.com>', 18 ],
  [ 'Diana Luik <dianaluik@yahoo.com>', 18 ],
  [ 'Matt De Nicola <mattdenicola@optonline.net>', 17 ],
  [ 'Equifax <info@e.equifax.com>', 17 ],
  [ 'Maria Mountain <help@goalietrainingpro.com>', 17 ],
  [ 'UPS <mcinfo@ups.com>', 17 ],
  [ 'Scarsdale Youth Hockey Association <no-reply@mailer.sportsengine.com>',
    17 ],
  [ 'Pamela Caldara <Notification@leagueathletics.com>', 17 ],
  [ 'GWM Reviews Team <gwm-review@google.com>', 17 ],
  [ 'Twitter <info@twitter.com>', 15 ],
  [ 'American Express <DoNotReplyUS@welcome.aexp.com>', 15 ],
  [ 'O2living <Business276828@mindbodyonline.com>', 15 ],
  [ 'Misfits Market <donotreply@misfitsmarket.com>', 14 ],
  [ 'Instructure Canvas <notifications@instructure.com>', 14 ],
  [ '"Amazon.com" <auto-confirm@amazon.com>', 13 ],
  [ 'The Athletic Pulse <TheAthletic@e1.theathletic.com>', 13 ],
  [ '"Amazon.com" <shipment-tracking@amazon.com>', 13 ],
  [ '"Yearbook (F)-0" <notifications@instructure.com>', 13 ],
  [ 'Town of Bedford <supervisor@bedfordny.gov>', 12 ],
  [ 'Westchester Parks Foundation <info@thewpf.org>', 12 ],
  [ 'Stack Overflow <do-not-reply@stackoverflow.email>', 12 ],
  [ 'The Harvey School <noreply@harvey.myenotice.com>', 12 ],
  [ 'Trout Unlimited <trout@tu.org>', 12 ],
  [ 'The Harvey School <plazzaro@harveyschool.org>', 12 ],
  [ '"Gov. Kathy Hochul" <email@exec.ny.gov>', 11 ],
  [ 'Irvin Simon Photographers <no-reply@imagequix.com>', 11 ],
  [ 'Assemblymember Chris Burdick <burdickc@nyassembly.gov>', 11 ],
  [ 'noreply@erblearn.org', 11 ],
  [ 'Coinbase Bytes <marketing@cb.mail.coinbase.com>', 11 ],
  [ 'Michael Schafer <mcs14@cornell.edu>', 11 ],
  [ 'USA Hockey <communications@usahockeyemails.org>', 10 ],
  [ '"Nied MD, Allison" <anied@caremount.com>', 10 ],
  [ '"United News & Deals" <UnitedAirlines@news.united.com>', 10 ],
  [ 'Info@bbosmiles.com', 10 ],
  [ 'LinkedIn <updates-noreply@linkedin.com>', 10 ],
  [ 'Bridget Palmieri <palmieri.ny@gmail.com>', 10 ],
  [ 'American Express Merchant Services <AmericanExpress@email.americanexpress.com>',
    10 ],
  [ '"Bloomingdale\'s" <Bloomingdales@email.bloomingdales.com>',
    9 ],
  [ '"Bloomingdale\'s Loyallist" <Bloomingdalesloyallist@loyallist.bloomingdales.com>',
    9 ],
  [ 'The Harvey School <mbooth@harveyschool.org>', 9 ],
  [ 'Verizon Wireless <VZWMail@ecrmemail.verizonwireless.com>',
    8 ],
  [ 'The Windward School Development Office <development@thewindwardschool.org>',
    8 ],
  [ 'Customer Service <customerservice@e-zpassny.com>', 8 ],
  [ 'Intuit QuickBooks <intuit@eq.intuit.com>', 8 ],
  [ 'ErrorReportingNotifications-noreply@google.com', 8 ],
  [ 'The Harvey School <wknauer@harveyschool.org>', 8 ],
  [ '"Amazon.com" <order-update@amazon.com>', 8 ],
  [ 'SportsEngine <no-reply@mailer.sportsengine.com>', 8 ],
  [ 'Sterling Talent Solutions <DoNotReply@talentwise.com>', 8 ],
  [ 'The Athletic Weekly <TheAthletic@e1.theathletic.com>', 7 ],
  [ 'Community Center of Northern Westchester <cmurray@communitycenternw.org>',
    7 ],
  [ 'Katonah Village Library <mkane@katonahlibrary.org>', 7 ],
  [ 'OneDrive <photos@onedrive.com>', 7 ],
  [ 'eBay <ebay@ebay.com>', 7 ],
  [ 'Subscriptions Department <noreply@a.email.hbr.org>', 7 ],
  [ 'YouTube TV <no-reply@youtube.com>', 7 ],
  [ 'The Harvey School <yearbook@ybk.herffjones.com>', 7 ],
  [ 'LinkedIn <jobs-noreply@linkedin.com>', 7 ],
  [ 'CAROLYN WHITMAN <csw54@comcast.net>', 7 ],
  [ 'Google Voice <voice-noreply@google.com>', 7 ],
  [ 'GitHub <noreply@github.com>', 7 ],
  [ 'Experian <support@e.usa.experian.com>', 6 ],
  [ 'Hulu <hulu@hulumail.com>', 6 ],
  [ 'Evan LeFloch <hello@homebotapp.com>', 6 ],
  [ 'Eden Brothers <offers@edenbrothers.com>', 6 ],
  [ 'Shekou Woman <info@shekouwoman.com>', 6 ],
  [ 'The Cornell Store <store@cornellstore.com>', 6 ],
  [ 'Google <no-reply@accounts.google.com>', 6 ],
  [ 'Google My Business <googlemybusiness-noreply@google.com>',
    6 ],
  [ 'Google Photos <noreply-photos@google.com>', 6 ],
  [ 'Crunchbase Daily <newsletter@email.crunchbase.com>', 6 ],
  [ 'Fidelity Investments <Fidelity.Investments@mail.fidelity.com>',
    6 ],
  [ 'HBR Store <noreply@a.email.hbr.org>', 6 ],
  [ '"Zachary Dingus, Trout Unlimited" <trout@tu.org>', 6 ],
  [ 'CJR Elite Hockey Club <Notification@leagueathletics.com>',
    6 ],
  [ 'Fine Animal Hospital <noreply@e.covetrus.com>', 6 ],
  [ 'The Economist <newsletters@e.economist.com>', 6 ],
  [ 'The Google Workspace Team <workspace@google.com>', 6 ],
  [ 'Windward Parents Association <wpa@thewindwardschool.org>',
    6 ],
  [ 'Brisnet <Brisnet@email.brisnet.com>', 6 ],
  [ '<Notification@leagueathletics.com>', 6 ],
  [ 'Craig Culver <cculver1@gmail.com>', 6 ],
  [ 'Maria Mitchell Association <kbernatzky@mariamitchell.org>',
    6 ],
  [ 'Jeremy Weiss <info@weisstechhockey.com>', 6 ],
  [ 'Delta Air Lines <DeltaAirLines@t.delta.com>', 6 ],
  [ 'MYHA Communications <Notification@leagueathletics.com>', 6 ],
  [ 'Google Nest <googlenest@google.com>', 6 ],
  [ 'Microsoft Store <microsoftstore@microsoftstoreemail.com>',
    5 ],
  [ 'NY Rangers <newyorkrangers@email1.msg.com>', 5 ],
  [ 'Stick Bandits <sales@stickbandits.com>', 5 ],
  [ 'Bobby Leiser <bobby.sentinelgoalie@gmail.com>', 5 ],
  [ '"Amazon.com" <no-reply@amazon.com>', 5 ],
  [ 'Boundless Adventures <lorrie@boundlessadventures.net>', 5 ],
  [ '"The Players\' Tribune" <newsletter@playerstribune.com>', 5 ],
  [ 'The Boston Globe <circulationoffers@email.globe.com>', 5 ],
  [ 'Google Calendar <calendar-notification@google.com>', 5 ],
  [ 'Stripe <support@stripe.com>', 5 ],
  [ 'E-ZPass Customer Service <ezpass@isecurus.com>', 5 ],
  [ 'Stu Hackel <stuhackel16@gmail.com>', 5 ],
  [ 'YouTube <no-reply@youtube.com>', 5 ],
  [ 'My Best Buy Visa Card <bestbuycard@info16.citi.com>', 5 ],
  [ 'Bedford Post Dining <info@bedfordpostdining.com>', 5 ],
  [ '"marissa sandoval (via Google Drive)" <drive-shares-dm-noreply@google.com>',
    5 ],
  [ '"Cornell, Timothy" <tcornell@harveyschool.org>', 5 ],
  [ 'Stewart Whitman <stewart.l.whitman@gmail.com>', 86 ],
  [ 'LinkedIn Job Alerts <jobalerts-noreply@linkedin.com>', 85 ],
  [ 'The Boston Globe <newsletters@email.bostonglobe.com>', 77 ],
  [ 'The New York Times <nytdirect@nytimes.com>', 71 ],
  [ 'The Boston Globe <newsletters@bostonglobe.com>', 67 ],
  [ 'The Athletic Daily <TheAthletic@e1.theathletic.com>', 64 ],
  [ 'American Express <americanexpress@member.americanexpress.com>',
    50 ],
  [ 'Mint <mint@em1.mint.intuit.com>', 42 ],
  [ 'Newrez <hello@eml.newrez.com>', 40 ],
  [ 'Mint <team@mint.com>', 39 ],
  [ 'New York State Department of Environmental Conservation <nysdec@public.govdelivery.com>',
    39 ],
  [ 'Reddit <noreply@redditmail.com>', 37 ],
  [ 'Venmo <venmo@venmo.com>', 37 ],
  [ 'Katonah-Lewisboro School District <alerts@klschools.org>',
    37 ],
  [ 'The Washington Post <email@washingtonpost.com>', 35 ],
  [ 'American Express <AmericanExpress@welcome.aexp.com>', 33 ],
  [ 'Microsoft Family Safety <familysafety@microsoft.com>', 33 ],
  [ 'Jamer Breene <jamerb3@gmail.com>', 33 ],
  [ 'Japanese 3-0 <notifications@instructure.com>', 30 ],
  [ 'Chase <no.reply.alerts@chase.com>', 28 ],
  [ 'The Economist Espresso <espresso@e.economist.com>', 26 ],
  [ 'William Steers <bill.steers@outlook.com>', 25 ],
  [ '"Darin D\'Ambrosio" <Notification@leagueathletics.com>', 25 ],
  [ 'Marriott Bonvoy <marriottbonvoy@email-marriott.com>', 24 ],
  [ 'Chase <no-reply@alertsp.chase.com>', 23 ],
  [ 'The Economist <noreply@e.economist.com>', 23 ],
  [ 'Fundrise <investments@fundrise.com>', 23 ],
  [ 'Allison Nied <allisonnied@gmail.com>', 23 ],
  [ '"Cornell University, Division of Alumni Affairs and Development" <alumniaffairs@cornell.edu>',
    22 ],
  [ 'The Economist today <newsletters@e.economist.com>', 21 ],
  [ 'Notification <Notification@leagueathletics.com>', 21 ],
  [ 'marissa sandoval <msandoval2121@gmail.com>', 21 ],
  [ 'Fidelity Investments <Fidelity.Alerts@fidelity.com>', 21 ],
  [ 'The Windward School <communications@thewindwardschool.org>',
    20 ],
  [ 'English 11-1 <notifications@instructure.com>', 19 ],
  [ 'Apple <no_reply@email.apple.com>', 18 ],
  [ 'Diana Luik <dianaluik@yahoo.com>', 18 ],
  [ 'Matt De Nicola <mattdenicola@optonline.net>', 17 ],
  [ 'Equifax <info@e.equifax.com>', 17 ],
  [ 'Maria Mountain <help@goalietrainingpro.com>', 17 ],
  [ 'UPS <mcinfo@ups.com>', 17 ],
  [ 'Scarsdale Youth Hockey Association <no-reply@mailer.sportsengine.com>',
    17 ],
  [ 'Pamela Caldara <Notification@leagueathletics.com>', 17 ],
  [ 'GWM Reviews Team <gwm-review@google.com>', 17 ],
  [ 'Twitter <info@twitter.com>', 15 ],
  [ 'American Express <DoNotReplyUS@welcome.aexp.com>', 15 ],
  [ 'O2living <Business276828@mindbodyonline.com>', 15 ],
  [ 'Misfits Market <donotreply@misfitsmarket.com>', 14 ],
  [ 'Instructure Canvas <notifications@instructure.com>', 14 ],
  [ '"Amazon.com" <auto-confirm@amazon.com>', 13 ],
  [ 'The Athletic Pulse <TheAthletic@e1.theathletic.com>', 13 ],
  [ '"Amazon.com" <shipment-tracking@amazon.com>', 13 ],
  [ '"Yearbook (F)-0" <notifications@instructure.com>', 13 ],
  [ 'Town of Bedford <supervisor@bedfordny.gov>', 12 ],
  [ 'Westchester Parks Foundation <info@thewpf.org>', 12 ],
  [ 'Stack Overflow <do-not-reply@stackoverflow.email>', 12 ],
  [ 'The Harvey School <noreply@harvey.myenotice.com>', 12 ],
  [ 'Trout Unlimited <trout@tu.org>', 12 ],
  [ 'The Harvey School <plazzaro@harveyschool.org>', 12 ],
  [ '"Gov. Kathy Hochul" <email@exec.ny.gov>', 11 ],
  [ 'Irvin Simon Photographers <no-reply@imagequix.com>', 11 ],
  [ 'Assemblymember Chris Burdick <burdickc@nyassembly.gov>', 11 ],
  [ 'noreply@erblearn.org', 11 ],
  [ 'Coinbase Bytes <marketing@cb.mail.coinbase.com>', 11 ],
  [ 'Michael Schafer <mcs14@cornell.edu>', 11 ],
  [ 'USA Hockey <communications@usahockeyemails.org>', 10 ],
  [ '"Nied MD, Allison" <anied@caremount.com>', 10 ],
  [ '"United News & Deals" <UnitedAirlines@news.united.com>', 10 ],
  [ 'Info@bbosmiles.com', 10 ],
  [ 'LinkedIn <updates-noreply@linkedin.com>', 10 ],
  [ 'Bridget Palmieri <palmieri.ny@gmail.com>', 10 ],
  [ 'American Express Merchant Services <AmericanExpress@email.americanexpress.com>',
    10 ],
  [ '"Bloomingdale\'s" <Bloomingdales@email.bloomingdales.com>',
    9 ],
  [ '"Bloomingdale\'s Loyallist" <Bloomingdalesloyallist@loyallist.bloomingdales.com>',
    9 ],
  [ 'The Harvey School <mbooth@harveyschool.org>', 9 ],
  [ 'Verizon Wireless <VZWMail@ecrmemail.verizonwireless.com>',
    8 ],
  [ 'The Windward School Development Office <development@thewindwardschool.org>',
    8 ],
  [ 'Customer Service <customerservice@e-zpassny.com>', 8 ],
  [ 'Intuit QuickBooks <intuit@eq.intuit.com>', 8 ],
  [ 'ErrorReportingNotifications-noreply@google.com', 8 ],
  [ 'The Harvey School <wknauer@harveyschool.org>', 8 ],
  [ '"Amazon.com" <order-update@amazon.com>', 8 ],
  [ 'SportsEngine <no-reply@mailer.sportsengine.com>', 8 ],
  [ 'Sterling Talent Solutions <DoNotReply@talentwise.com>', 8 ],
  [ 'The Athletic Weekly <TheAthletic@e1.theathletic.com>', 7 ],
  [ 'Community Center of Northern Westchester <cmurray@communitycenternw.org>',
    7 ],
  [ 'Katonah Village Library <mkane@katonahlibrary.org>', 7 ],
  [ 'OneDrive <photos@onedrive.com>', 7 ],
  [ 'eBay <ebay@ebay.com>', 7 ],
  [ 'Subscriptions Department <noreply@a.email.hbr.org>', 7 ],
  [ 'YouTube TV <no-reply@youtube.com>', 7 ],
  [ 'The Harvey School <yearbook@ybk.herffjones.com>', 7 ],
  [ 'LinkedIn <jobs-noreply@linkedin.com>', 7 ],
  [ 'CAROLYN WHITMAN <csw54@comcast.net>', 7 ],
  [ 'Google Voice <voice-noreply@google.com>', 7 ],
  [ 'GitHub <noreply@github.com>', 7 ],
  [ 'Experian <support@e.usa.experian.com>', 6 ],
  [ 'Hulu <hulu@hulumail.com>', 6 ],
  [ 'Evan LeFloch <hello@homebotapp.com>', 6 ],
  [ 'Eden Brothers <offers@edenbrothers.com>', 6 ],
  [ 'Shekou Woman <info@shekouwoman.com>', 6 ],
  [ 'The Cornell Store <store@cornellstore.com>', 6 ],
  [ 'Google <no-reply@accounts.google.com>', 6 ],
  [ 'Google My Business <googlemybusiness-noreply@google.com>',
    6 ],
  [ 'Google Photos <noreply-photos@google.com>', 6 ],
  [ 'Crunchbase Daily <newsletter@email.crunchbase.com>', 6 ],
  [ 'Fidelity Investments <Fidelity.Investments@mail.fidelity.com>',
    6 ],
  [ 'HBR Store <noreply@a.email.hbr.org>', 6 ],
  [ '"Zachary Dingus, Trout Unlimited" <trout@tu.org>', 6 ],
  [ 'CJR Elite Hockey Club <Notification@leagueathletics.com>',
    6 ],
  [ 'Fine Animal Hospital <noreply@e.covetrus.com>', 6 ],
  [ 'The Economist <newsletters@e.economist.com>', 6 ],
  [ 'The Google Workspace Team <workspace@google.com>', 6 ],
  [ 'Windward Parents Association <wpa@thewindwardschool.org>',
    6 ],
  [ 'Brisnet <Brisnet@email.brisnet.com>', 6 ],
  [ '<Notification@leagueathletics.com>', 6 ],
  [ 'Craig Culver <cculver1@gmail.com>', 6 ],
  [ 'Maria Mitchell Association <kbernatzky@mariamitchell.org>',
    6 ],
  [ 'Jeremy Weiss <info@weisstechhockey.com>', 6 ],
  [ 'Delta Air Lines <DeltaAirLines@t.delta.com>', 6 ],
  [ 'MYHA Communications <Notification@leagueathletics.com>', 6 ],
  [ 'Google Nest <googlenest@google.com>', 6 ],
  [ 'Microsoft Store <microsoftstore@microsoftstoreemail.com>',
    5 ],
  [ 'NY Rangers <newyorkrangers@email1.msg.com>', 5 ],
  [ 'Stick Bandits <sales@stickbandits.com>', 5 ],
  [ 'Bobby Leiser <bobby.sentinelgoalie@gmail.com>', 5 ],
  [ '"Amazon.com" <no-reply@amazon.com>', 5 ],
  [ 'Boundless Adventures <lorrie@boundlessadventures.net>', 5 ],
  [ '"The Players\' Tribune" <newsletter@playerstribune.com>', 5 ],
  [ 'The Boston Globe <circulationoffers@email.globe.com>', 5 ],
  [ 'Google Calendar <calendar-notification@google.com>', 5 ],
  [ 'Stripe <support@stripe.com>', 5 ],
  [ 'E-ZPass Customer Service <ezpass@isecurus.com>', 5 ],
  [ 'Stu Hackel <stuhackel16@gmail.com>', 5 ],
  [ 'YouTube <no-reply@youtube.com>', 5 ],
  [ 'My Best Buy Visa Card <bestbuycard@info16.citi.com>', 5 ],
  [ 'Bedford Post Dining <info@bedfordpostdining.com>', 5 ],
  [ '"marissa sandoval (via Google Drive)" <drive-shares-dm-noreply@google.com>',
    5 ],
  [ '"Cornell, Timothy" <tcornell@harveyschool.org>', 5 ]]

  return senderArr;
}