// This script automatically generates a tag's table of games and examples
// by Ethan Chen

// To apply the table, the below should be located somewhere in the html5 markup:
// <figure class="table" id="tagInfo" data-tag="<name of tag here>"></figure>
  
// The following are sources I referenced from:  
//https://stackoverflow.com/questions/16485255/how-do-you-import-data-from-a-google-sheets
//https://stackoverflow.com/questions/70902197/accessing-a-public-google-sheets-data-directly-from-client-side-javascript
//https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
//https://www.w3schools.com/howto/howto_js_sort_table.asp
// https://stackoverflow.com/questions/181596/how-to-convert-a-column-number-e-g-127-into-an-excel-column-e-g-aa
  
// Regarding sheet rate limits:
// https://stackoverflow.com/questions/70349368/what-is-the-limitation-of-google-published-csv


 var id = '1OLx9vr4pR6PtT63MAPaU0qvf5N2WclZ5I1y3ifjkQig';
  var gid = '0';
  
  
function sortTable(table ) {
  var rows, switching, i, x, y, shouldSwitch;
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      // Check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        // If so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function getExcelColumnName(columnNumber)
{
    var columnName = "";
		
    while (columnNumber > 0)
    {
        var modulo = (columnNumber - 1) % 26;
        columnName = String.fromCharCode(65 + modulo) + columnName;
        columnNumber = Math.floor((columnNumber - modulo) / 26);
    } 

    return columnName;
}
  
function splitCSV(str){
  str = str.substring(1, str.length-1)
  var arr
  if (str.search('","') > -1){
  	arr = str.split('","')
  }else{
  	arr = str.split('"\n"')
  }
	return arr
}
function splitQueryCSV(str){
  str = str.substring(1, str.length-1)
  var arr = str.split('"\n"')
  var dict = {}
  for (var i in arr){
		var pair = arr[i].split('","')
    dict[pair[0]] = pair[1]
  }
  return dict
}

//Returns a dictionary where key is from column A, and value is from column str, and the value isn't null
function arrQueryCallback(str, callback){
  var range = 'A5:'+str;
  var tq = 'SELECT A,'+str+' WHERE '+str+' IS NOT NULL'
  var url = 'https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:csv&keep-empty=true&range='+range+'&gid='+gid+'&tq='+tq;
  xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function () {
              if (xmlhttp.readyState == 4) {
                	console.log(xmlhttp.responseText)
                  callback(splitQueryCSV(xmlhttp.responseText))
              }
          };
          xmlhttp.open("GET", url, true);
          xmlhttp.send(null); 
}
function arrRangeCallback(str, callback){
  var url = 'https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:csv&range='+str+':'+str+'&tq&gid='+gid;
  xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function () {
              if (xmlhttp.readyState == 4) {
                	console.log(xmlhttp.responseText)
                  callback(splitCSV(xmlhttp.responseText))
              }
          };
          xmlhttp.open("GET", url, true);
          xmlhttp.send(null);
}

function createTableElement(gameName){
  var table = document.createElement("table")
  var tbody = document.createElement("tbody")
  table.append(tbody)
  //First row headers
  {
  	let tr = document.createElement("tr") 
  	let tdGame = document.createElement("td") 
  	let tdUse = document.createElement("td") 
    let h1Game = document.createElement("h1")
    let h1Use = document.createElement("h1")
    tr.append(tdGame)
    tdGame.append(h1Game)
    tr.append(tdUse)
    tdUse.append(h1Use)
    h1Game.innerHTML = "Game"
    h1Use.innerHTML = "Use In Game"
    tbody.append(tr)
  }
  var tagColumn = ""
 	var gameDict = []
  
  // assume this function is called when above variables are set properly
  var fillEntries = function(){
    for(var name in gameDict){
     	var example = gameDict[name]
  		let tr = document.createElement("tr") 
  		let tdGame = document.createElement("td") 
  		let tdUse = document.createElement("td") 
    	tr.append(tdGame)
    	tr.append(tdUse)
    	tdUse.innerHTML = example
      //Create link for tag
     	let a = document.createElement("a")
      a.setAttribute('href', '/list-of-video-games/' + name.replace(/[^a-z0-9()]/gmi, " ").replace(/\s+/g, "-"));
      a.innerHTML = name
      tdGame.append(a)
    	tbody.append(tr)
    }
    //sort table alphabetically
    sortTable(table)
  }
  
  // 2 stage callback chain to get array data from the tag list
  var onGameDictGet = function(arr){
    gameDict = arr
    fillEntries()
  }
  var onTagsGet = function(arr){
    tagColumn = arr.indexOf(gameName)+1 //shift to account for row/column offset in sheet
    arrQueryCallback(getExcelColumnName(tagColumn),onGameDictGet)
  } 
  arrRangeCallback("4",onTagsGet)
	return table
}

// window.onload must be set to wait until all elements are loaded, otherwise element retrieval methods return null
window.onload = function(){
  var figure = document.getElementById("tagInfo")
  var tagName = figure.dataset.tag//"Attacking"
  var table = createTableElement(tagName)
  figure.append(table)
}
