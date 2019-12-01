import ext from "./utils/ext";
import Speech from 'speak-tts' // es6

var place = document.getElementById("app")
var ttsSupport = function () {
  const speech = new Speech() // will throw an exception if not browser supported
  if(speech.hasBrowserSupport()) { // returns a boolean
    console.log("speech synthesis supported")
  }

  speech.init().then((data) => {
    // The "data" object contains the list of available voices and the voice synthesis params
    console.log("Speech is ready, voices are available", data)
  }).catch(e => {
    console.error("An error occured while initializing : ", e)
  })

}

place.addEventListener("click", function(e) {
  if(e.target && e.target.matches("#play")) {
    play(e);
  }
  if(e.target && e.target.matches("#next")) {
    next(e);
  }
  if(e.target && e.target.matches("#prev")) {
    prev(e);
  }
  if(e.target && e.target.matches("#stop")) {
    stopTTS(e);
  }
  if(e.target && e.target.matches("#closeWindow")) {
    window.close();
  }
});

var dumSplittdMode = false;
var stop = false;


function play(e) {
  stop = false;
  if(ttsPosition>0){
    ttsPosition--;
  }
  next(e);


}
var nodes;
function initRange() {
  nodes = document.getElementsByTagName("p");
}
function next(e) {
  ttsPosition++;
  var phase = coloringCurrentNode(nodes[ttsPosition], nodes[ttsPosition-1]);
  while(checkSkip(phase)){
    phase = coloringCurrentNode(nodes[ttsPosition], nodes[ttsPosition-1]);
  }
  _prepareSpeakButton(speech, phase, next)
}

function checkSkip(targetText) {
  if(targetText.indexOf("src") >= 0){
    return true;
  }

  return false;

}

function prev(e) {
  ttsPosition--;
  var phase = coloringCurrentNode(nodes[ttsPosition], nodes[ttsPosition-1]);
  _prepareSpeakButton(speech, phase, next)
}
function stopTTS(e) {
  console.log("stopTTS")
  stop = true;
  speech.pause();
  speech.cancel();
}

const speech = new Speech();

function init() {
  var language = window.navigator.language || window.navigator.userLanguage; //for IE
  const docLang = document.getElementById("docLang").innerHTML;
  var targetLang;
  if(docLang != undefined && docLang != 'undefined' && docLang != ''){
    targetLang = docLang
  }else{
    targetLang = language;
  }

  console.log("init language set", targetLang)
  speech
    .init({
      volume: 0.5,
      lang: language,
      rate: 1.2,
      pitch: 1,
      //'voice':'Google UK English Male',
      //'splitSentences': false,
      listeners: {
        onvoiceschanged: voices => {
          console.log("Voices changed", voices);
        }
      }
    })
    .then(data => {
      console.log("Speech is ready", data);
      _addVoicesList(data.voices,targetLang);
      // makeup("readability-page-1")
      // _prepareSpeakButton(speech);
      initRange();
    })
    .catch(e => {
      console.error("An error occured while initializing : ", e);
    });
  const text = speech.hasBrowserSupport()
    ? "TTS ok"
    : "TTS not supported";
  document.getElementById("support").innerHTML = text;
}

const _addVoicesList = (voices, preferLanguage) => {
  const list = window.document.createElement("div");


  let html =
    '<b>Available Voices</b> <select id="languages"><option value="">autodetect language</option>';
  voices.forEach(voice => {

    var selected = '';
    console.log(voice.lang, preferLanguage)

    if(voice.lang.indexOf(preferLanguage)>= 0){
      console.log(voice.lang ,'selected')
      selected = "SELECTED"
    }
    html += `<option value="${voice.lang}" data-name="${voice.name}" ${selected}>${
      voice.name
      } (${voice.lang})</option>`;
  });
  list.innerHTML = html;
  document.getElementById("supportedLanguages").appendChild(list);
  // window.document.body.appendChild(list);
};
function makeup(id) {
  document
    .getElementById(id)

    .childNodes.forEach(function(node, key, parent) {
    // console.log(key, node.toString());
    if (node.nodeName == "#text") {
      var span = document.createElement("span");
      span.innerText = node.textContent;
      node.replaceWith(span);
    }
  });
}

var ttsPosition = 0;

function suspend(speech){

}

function coloringCurrentNode(currentNode,prevNode) {
  if (prevNode != undefined && prevNode.classList != undefined) {
    prevNode.classList.remove("tts-focus");
  }
  if (currentNode != undefined && currentNode.classList != undefined) {
    currentNode.classList.add("tts-focus");
  }
  console.log("node", currentNode, currentNode.textContent)
  currentNode.scrollIntoView()
  window.scrollBy(0, -200); // Adjust scrolling with a negative value here
  return currentNode.textContent;
}

function _prepareSpeakButton(speech, phase, onNext) {
  if(stop){
    console.info("check, is stoped", stop)
    return
  }
  const languages = document.getElementById("languages");
    const language = languages.value;
    const voice = languages.options[languages.selectedIndex].dataset.name;
    if (language) speech.setLanguage(languages.value);
    if (voice) speech.setVoice(voice);
    speech
      .speak({
        text: phase,
        queue: false,
        listeners: {
          onstart: () => {
            // console.log("Start utterance");
          },
          onend: () => {
            // console.log("End utterance");
          },
          onresume: () => {
            // console.log("Resume utterance");
          },
          onboundary: event => {
            console.log(
              event.name +
              " boundary reached after " +
              event.elapsedTime +
              " milliseconds."
            );
          }
        }
      })
      .then(data => {
        console.log("Success !", data);
        if(onNext != undefined) {
          onNext()
        }
      })
      .catch(e => {
        console.error("An error occurred :", e);
      });

}
init()