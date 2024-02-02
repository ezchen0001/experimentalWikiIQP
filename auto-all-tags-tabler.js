// This script automatically generates a list of all the tags and their general definitions
// by Ethan Chen

// To apply the table, the below should be located somewhere in the html5 markup:
// <figure class="table" id="allTags" ></figure>
  
// The following are sources I referenced from:  
//https://stackoverflow.com/questions/16485255/how-do-you-import-data-from-a-google-sheets
//https://stackoverflow.com/questions/70902197/accessing-a-public-google-sheets-data-directly-from-client-side-javascript
//https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
//https://www.w3schools.com/howto/howto_js_sort_table.asp

// Regarding sheet rate limits:
// https://stackoverflow.com/questions/70349368/what-is-the-limitation-of-google-published-csv
  
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

function arrRangeCallback(str, callback){
	var id = '1OLx9vr4pR6PtT63MAPaU0qvf5N2WclZ5I1y3ifjkQig';
  var gid = '0';
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

function createTableElement(){
  var table = document.createElement("table")
  var tbody = document.createElement("tbody")
  table.append(tbody)
  var loadingDiv = document.createElement("div")
  loadingDiv.innerHTML = "Loading table..."
  table.append(loadingDiv)
  
 	var tagDefinitions = []
  var tagExCount = []
  var tagNames = []
  
  // assume this function is called when above variables are set properly
  var fillEntries = function(){
    //First row headers
  {
  	let tr = document.createElement("tr") 
  	let tdTag = document.createElement("td") 
  	let tdUse = document.createElement("td") 
    let h1Tag = document.createElement("h1")
    let h1Use = document.createElement("h1")
    tr.append(tdTag)
    tdTag.append(h1Tag)
    tr.append(tdUse)
    tdUse.append(h1Use)
    h1Tag.innerHTML = "Tag"
    h1Use.innerHTML = "Definition"
    tbody.append(tr)
  }
    for(var i = 1; i < tagDefinitions.length; i++){
     	var example = tagDefinitions[i]
      var count = tagExCount[i] 
      if (Number(tagExCount[i]) < 2) { //skip tag if niche 
      	continue
      } 
      var name = tagNames[i]
  		let tr = document.createElement("tr") 
  		let tdTag = document.createElement("td") 
  		let tdUse = document.createElement("td") 
    	tr.append(tdTag)
    	tr.append(tdUse)
    	tdUse.innerHTML = example
      
      let a = document.createElement("a")
      a.setAttribute('href', '/tags-and-definitions/' + name.replace(/[^a-z0-9()']/gmi, " ").replace(/\s+/g, "-"));
      a.innerHTML = name
      tdTag.append(a)
      
    	tbody.append(tr)
    }
    //sort table alphabetically
    sortTable(table)
    // end loading
    loadingDiv.remove()
  }
  
  // 3 stage callback chain to get array data from the tag list
  var onTagNamesGet = function(arr){
    tagNames = arr
    fillEntries()
  }
  var onTagExCountGet = function(arr){
    tagExCount = arr
  	arrRangeCallback("4",onTagNamesGet)
  }
  var onTagDefinitionsGet = function(arr){
    tagDefinitions = arr
  	arrRangeCallback("3",onTagExCountGet)
  }
  arrRangeCallback("2",onTagDefinitionsGet)
	return table
}

// window.onload must be set to wait until all elements are loaded, otherwise element retrieval methods return null
window.onload = function(){
  var id = '1OLx9vr4pR6PtT63MAPaU0qvf5N2WclZ5I1y3ifjkQig';
  var gid = '0';
  var url = 'https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:json&tq&gid='+gid;
  var figure = document.getElementById("allTagsInfo")
  var table = createTableElement()
  figure.append(table)
}
