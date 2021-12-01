var restultsArr = []
//Timeout
        cache.putNumber('counterCache', counter, ttl) // cache the count
        cache.putNumber('ruleLoopCache', i, ttl); // cache the rule loop location
        cache.putNumber('threadLoopCache', j, ttl); // cache the thread loop location
        Logger.log(`${user} - Timed out at partial count of ${counter} in Rule ${i} and Thread ${j}. Values put in cache`);
          
          
          
//one rule loop completed          
          resultsArr.push ([{ id: i, counter: counter, action: action, searchString:searchString, days:days }])
          cache.putObject(`result`, resultsArr);



function printTable() {
    var mainObj = cache.getObject('result')
    var k = '<tbody>'
    for(i = 0;i < mainObj.length; i++){
        k+= '<tr>';
        k+= '<td>' + mainObj[i].id + '</td>';
        k+= '<td>' + mainObj[i].action + '</td>';
        k+= '<td>' + mainObj[i].searchString + '</td>';
        k+= '<td>' + mainObj[i].days + '</td>';
        k+= '<td>' + mainObj[i].counter + '</td>';
        k+= '</tr>';
    }
    k+='</tbody>';
    Logger.log (k);
}        