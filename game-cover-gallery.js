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
  
  var coverGallery = document.getElementById("coverGallery")
  //shallow copy since the .children property updates live
  var children = [...coverGallery.children];
  for (var image of children){
    	image.classList.add("coverItem")
    	var gameName = image.alt
      
    	var a = document.createElement("a")
      a.classList.add("coverItem")
      a.href = 'list-of-video-games/'+gameName.replace(/[^a-z0-9()]/gmi, " ").replace(/\s+/g, "-")
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
