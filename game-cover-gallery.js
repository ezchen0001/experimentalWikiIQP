// Cover Gallery Script
// Lays out images in a gallery-like format.
// Each of the images shows a tooltip of the game name when hovers, and links to a determined game page
// by Ethan Chen

// Sources I utilized:
// https://www.w3schools.com/css/css_tooltip.asp
// https://www.freecodecamp.org/news/how-to-clone-an-array-in-javascript-1d3183468f6a/
// https://www.w3schools.com/css/css3_shadows.asp
// https://www.w3schools.com/css/css3_gradients_radial.asp

// Vertical alignment (is painful):
// http://phrogz.net/css/vertical-align/index.html
  
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
function reformatName(gameName){
	return gameName.toLowerCase().replace(/[^a-z0-9()']/gmi, " ").replace(/\s+/g, "-") 
}
  
var extensions = [".png",".jpg",".jpeg",".webp",".gif"]
function logMissingLink(path){
		var errors = document.getElementById("errors") 
    if( errors.innerHTML == ""){
    	errors.innerHTML = "The following images could not be found: <br>"
    } 
		errors.innerHTML += path + " <br>"
}
function testExtensions(img, path, ext){
  
		for(var i = 0; i < extensions.length; ++i){
      if(i == extensions.length - 1){
        img.onerror = function(){
        	logMissingLink(path + ".png")
        }
      	break 
      }
  		if(extensions[i] == ext){
      	 var newExt = extensions[i+1]
         img.onerror = function(){
         		 testExtensions(img, path, newExt)
         }
       	 break
      }
  	}
  
  img.src = path + ext
}
function formatCovers () {
  var coverGallery = document.getElementById("coverGallery")
  //shallow copy since the .children property updates live
  var children = [...coverGallery.children];
  for (var image of children){
    	image.classList.add("coverItem")
    	var gameName = image.alt
      
    	var a = document.createElement("a")
      a.classList.add("coverItem")
      a.href = '/list-of-video-games/'+ reformatName(gameName)
    	var vertDiv = document.createElement("div")
      vertDiv.classList.add("vertDiv")
    	
    	var tooltip = document.createElement("span")
      tooltip.classList.add("coverItem")
      tooltip.innerHTML = image.alt
    	a.append(vertDiv)
    	vertDiv.append(image)
    	a.append(tooltip)
    	coverGallery.append(a)
  }
}
window.onload = function(){
  //css begins here
  const style = document.createElement("style")
		style.textContent = `#coverGallery {
  text-align: center;
  margin: 10px;
  padding: 20px;
  border-radius: 5px;
  border-style: groove;
  position: relative;
  width: fit-content;
  vertical-align: middle
}
.vertDiv {
  height: 100%;
  width: 100%;
  line-height: 190px
}
img.coverItem {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
  border-radius: 5px;
  box-shadow: 0 0 8px #aaa;
  display: inline-block;
  vertical-align: middle
}
a.coverItem {
  height: 200px;
  width: 200px;
  background-color: #aaa;
  margin: 10px;
  padding: 0 20px 20px 20px;
  position: relative;
  display: inline-block;
  transition-duration: .3s;
  transition-property: padding,margin;
  border-radius: 5px;
  border-style: groove;
  background-image: radial-gradient(#555,#aaa);
  vertical-align: middle
}
a.coverItem:hover {
  padding: 0
}
a.coverItem span.coverItem {
  visibility: hidden;
  width: 120px;
  background-color: #000;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 10px 0;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -60px
}
a.coverItem:hover span.coverItem {
  visibility: visible
}`
	document.head.appendChild(style)
  
// css ends here
  
  
  var onGamesGet = function(arr){
    var div = document.getElementById("coverGallery")
    for(var i = 3; i < arr.length; ++i){
    	var img = document.createElement("img")
      img.alt = arr[i]
      testExtensions(img, '/game-covers/' + reformatName(arr[i]+" Cover"), ".png")
      div.append(img)
    }
    formatCovers()
  }
  arrRangeCallback("A",onGamesGet)
  
}
