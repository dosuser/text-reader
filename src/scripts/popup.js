import ext from "./utils/ext";
import storage from "./utils/storage";

var popup = document.getElementById("app");
storage.get('color', function(resp) {
  var color = resp.color;
  if(color) {
    popup.style.backgroundColor = color
  }
});

var template = (data) => {
  var json = JSON.stringify(data);
  return (`
  <input type="text" id="tmpClipboard" style="display: none" />

  <div class="action-container">
      <!--<button data-bookmark='{json}' id="save-btn" class="btn btn-primary">Save</button>-->
    <button id="save-btn" class="btn btn-primary">Save</button>
  </div>
    <div class="action-container">
    <button id="clipboard-btn" class="btn btn-primary">copy Clipboard</button>
    <button id="share-btn" class="btn btn-primary">share</button>
    <button id="new-btn" class="btn btn-primary">new</button>
    <button id="tts-btn" class="btn btn-primary">tts</button>

  </div>
  <div class="site-description">
    <h3 class="title">${data.title}</h3>
    <p class="description"><pre>${data.description}</pre></p>
    <a href="${data.url}" target="_blank" class="url">${data.url}</a>
  </div>

  
  <textarea id="content" >${data.content}</textarea>
  <textarea id="raw" >${data.raw}</textarea>

  `);
}
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

var renderBookmark = (data) => {
  var displayContainer = document.getElementById("display-container")
  if(data) {
    var tmpl = template(data);
    displayContainer.innerHTML = tmpl;

    try {
      displayContainer.innerHTML = tmpl;
    }catch (e) {
      console.log(e)
      // if(e.contains('The page’s settings blocked the loading of a resource at inline')){
      //   console.log("security violation")
      // }
      renderMessage(e)

    }
  } else {
    renderMessage("Sorry, could not extract this page's title and URL")
  }
}

ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
});

popup.addEventListener("click", function(e) {
  if(e.target && e.target.matches("#save-btn")) {
    console.log("copyClipboard")
    alert("save")
    e.preventDefault();
    var data = e.target.getAttribute("data-bookmark");
    ext.runtime.sendMessage({ action: "perform-save", data: data }, function(response) {
      if(response && response.action === "saved") {
        renderMessage("Your bookmark was saved successfully!");
      } else {
        renderMessage("Sorry, there was an error while saving your bookmark.");
      }
    })
  }
  if(e.target && e.target.matches("#clipboard-btn")) {
    e.preventDefault();

    try {

      var copyText = document.getElementById("content");
      var tmpClipboard = document.getElementById("tmpClipboard");
      tmpClipboard.style.display = 'block'
      tmpClipboard.value = copyText.innerHTML
      // alert(tmpClipboard.value )
      tmpClipboard.select();
      document.execCommand("copy");
      tmpClipboard.style.display = 'none'

    }catch (e) {
      alert(e)
    }
    return false
  }
  if(e.target && e.target.matches("#share-btn")) {
    e.preventDefault();

    try {
      if(navigator.share == undefined || navigator.share == null){
        return false
      }
      navigator.share({
        title: document.title,
        text: document.getElementById("content").innerText,
        url: "test",
      }); // share the URL of MDN

    }catch (e) {
      alert(e)
    }
    return false
  }
  if(e.target && e.target.matches("#new-btn")) {
    e.preventDefault();
    const targetBody = document.getElementById("content").innerHTML;
    newWin(e,targetBody)
    return false
  }

  if(e.target && e.target.matches("#tts-btn")) {
    e.preventDefault();
    const targetBody = document.getElementById("content").innerHTML;
    ttsWin(e,targetBody)
    return false
  }
});
function htmlDecode(input)
{
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}
function newWin(e, targetBody){
  let subWindow = window.open("empty.html", "_new");
  if(subWindow == null){
    return;
  }
  subWindow.addEventListener('load', function () {
    // alert(targetBody)
    const place = subWindow.document.getElementById("place");
    place.innerHTML = htmlDecode(targetBody);

  }, true);
}


function ttsWin(e, targetBody){
  let subWindow = window.open("tts.html", "_new");
  if(subWindow == null){
    return;
  }
  subWindow.addEventListener('load', function () {
    // alert(targetBody)
    const place = subWindow.document.getElementById("place");
    place.innerHTML += htmlDecode(targetBody);

  }, true);
}


var optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
})
