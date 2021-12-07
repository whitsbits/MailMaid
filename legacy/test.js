          
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