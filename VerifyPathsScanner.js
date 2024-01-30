// This script allows the user to scan the site to ensure that each game and tag have their pages in the correct url location.
// by Ethan Chen

// To apply the table, the below should be located somewhere in the html5 markup:
// <figure class="table" id="allTags" ></figure>

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

function toURL(category, name){
	return 'https://gameanalysiswiki.wpi.edu/'  + category + "/" + name.replace(/[^a-z0-9()]/gmi, " ").replace(/\s+/g, "-")
}
  
  
function checkPageCallback(url, callback){
  console.log("Checking " + url)
  var xhr = new XMLHttpRequest();
	xhr.onloadend = function() {
  		console.log("Status: " + xhr.status)
    	
 			callback(xhr.status == 200)
	}
	xhr.open("HEAD", url, true);
  xhr.send()
}
var isScanning = false
function onScan(){
  if (isScanning) {
    return
  }
  isScanning = true
  var status = document.getElementById("status")
  var updateStatus = function (str){
  	 status.innerHTML = "Status: " + str
  }
  var tagNames = []
  // consists of 2-length arrays that are arranged like [name of tag/game, url to page]
	var nameURLpairs = []
  // consists of indices to nameURLpairs
  var invalidPages = []
  var iterator = 0
  
  // assume nameURLpairs is populated when called
  var displayResults = function(){
    var output = ""
    if (invalidPages.length > 0){
    	output += "The following paths need to be rechecked. <br><em>(The page doesn't exist because it wasn't created, or an existing page needs to be moved to the correct url listed.)</em> <br> <br>" 
    }else {
      output += "No invalid pages found." 
    }
    for (var i = 0; i < invalidPages.length; i++){
      var pair = nameURLpairs[invalidPages[i]]
			output += "-" + pair[0] + ": &emsp;&emsp;<em>" + pair[1] + "</em><br>"
    }
    updateStatus(output)
    isScanning = false
  }
  
  var onCheckPage
  onCheckPage = function(pageStatus){
    if(!pageStatus){
  		invalidPages.push(iterator)
    }
    iterator++
    if(iterator == nameURLpairs.length){
      displayResults()
      return
    }
    updateStatus("Checking " + nameURLpairs[iterator][0] + "...")
    checkPageCallback(nameURLpairs[iterator][1], onCheckPage)
  }
  
  var onGamesGet = function(arr){
    for(var i = 3; i < arr.length; i++){
      var name = arr[i]
      nameURLpairs.push([name, toURL('list-of-video-games', name)])
    }
    updateStatus("Checking " + nameURLpairs[iterator][0] + "...")
    checkPageCallback(nameURLpairs[iterator][1], onCheckPage)
  }
  var onTagsCountGet = function(arr){
    // check only for non-niche tags
    for(var i = 1; i < arr.length; i++){
    	if(Number(arr[i]) < 2){ //skip if niche
      	continue
      }
      var name = tagNames[i]
      nameURLpairs.push([name, toURL('tags-and-definitions', name)])
    }
    updateStatus("Getting Games...")
  	arrRangeCallback("A", onGamesGet)
  }
  
  var onTagsGet = function(arr){
    tagNames = arr
  	arrRangeCallback("3", onTagsCountGet)
  }
  updateStatus("Getting Tags...")
  arrRangeCallback("4", onTagsGet)
}
window.onload = function(){
	document.getElementById("scanButton").onclick = onScan 
}
