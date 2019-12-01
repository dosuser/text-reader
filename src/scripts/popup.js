import ext from "./utils/ext";

var popup = document.getElementById("app");

var template = (data) => {
  return {
    data: data,
    text: `

  <div class="site-description">
    <h3 class="title">${data.title}</h3>
    <!--<p>document language : ${data.docLang}</p>-->
    <p class="description" style="text-overflow: ellipsis;">${data.description}</p>
    <a href="${data.url}" target="_blank" class="url">${data.url}</a>
  </div>
    <button id="tts-btn" class="btn btn-primary">
    <i class="material-icons">accessibility</i>
    Start TTS</button>
  `
  };
}
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

var renderBookmark = (data, retriveFunc) => {
  var displayContainer = document.getElementById("display-container")
  if (retriveFunc != undefined) {
    retriveFunc(data)
  }
  if (data) {
    var tmpl = template(data);

    displayContainer.innerHTML = tmpl.text;

    try {
      displayContainer.innerHTML = tmpl.text;
    } catch (e) {
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

ext.tabs.query({active: true, currentWindow: true}, function (tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, {action: 'process-page'}, function (data) {
    renderBookmark(data, function (data2) {
    });
  });
});

popup.addEventListener("click", function (e) {
   if (e.target && e.target.matches("#tts-btn")) {
    ext.tabs.query({active: true, currentWindow: true}, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {action: 'process-page'}, function (data) {
        ttsWin(e, data)

      });
    });

  }
});

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}


function ttsWin(e, data) {
  let subWindow = window.open("tts.html", "_new");
  if (subWindow == null) {
    return;
  }
  subWindow.addEventListener('load', function () {
    // alert(targetBody)


    const docLang = subWindow.document.getElementById("docLang");
    docLang.innerHTML = data.docLang;

    const place = subWindow.document.getElementById("place");
    place.innerHTML += data.content;
    const docTitle = subWindow.document.getElementById("reader-title");
    docTitle.innerHTML = data.title;
    const docLength = subWindow.document.getElementById("reader-estimated-time");
    // docLength.innerHTML = data.docLength;
    var runScript = subWindow.document.createElement("script");

    runScript.src = "scripts/tts.js";
    place.appendChild(runScript);


    window.close()

  }, true);

}


var optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function (e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('about.html')});
})
