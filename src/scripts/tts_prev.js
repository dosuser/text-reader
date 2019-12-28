import ext from "./utils/ext";

var initialized = false;
ext.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    sendResponse({ action: "saved" });
    console.log(request)
    if(request.action === "hello") {
      if(initialized == true){
        return
      }else{
        initialized = true
      }
      const place = document.getElementById("place");
      place.innerHTML = request.data.content;

      const docLang = document.getElementById("docLang");
      docLang.innerHTML = request.data.docLang;

      const docTitle = document.getElementById("reader-title");
      docTitle.innerHTML = request.data.title;
      const docLength = document.getElementById("reader-estimated-time");
      // docLength.innerHTML = data.docLength;
      var runScript = document.createElement("script");

      runScript.src = "scripts/tts.js";
      place.appendChild(runScript);

      // window.alert("ok")
    }
  }
);