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

});

function play(e) {
  alert("play")

}
var nodes;
function initRange() {
  nodes = document.getElementsByTagName("p");
}
function next(e) {
  ttsPosition++;
  var phase = coloringCurrentNode(nodes[ttsPosition], nodes[ttsPosition-1]);
  _prepareSpeakButton(speech, phase, next)
}
function prev(e) {
  focusPrev(ttsPosition,--ttsPosition)
}

const speech = new Speech();

function _init() {
  speech
    .init({
      volume: 0.5,
      lang: "ko-KR",
      rate: 1,
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
      _addVoicesList(data.voices);
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

const _addVoicesList = voices => {
  const list = window.document.createElement("div");
  let html =
    '<h2>Available Voices</h2><select id="languages"><option value="">autodetect language</option>';
  voices.forEach(voice => {
    html += `<option value="${voice.lang}" data-name="${voice.name}">${
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
function focusNext(i) {
  console.log("focus ", i);

  var node = document.getElementById("main").childNodes[i];
  if (
    node.previousSibling != undefined &&
    node.previousSibling.classList != undefined
  ) {
    node.previousSibling.classList.remove("tts-focus");
  }
  if (node.classList != undefined) {
    node.classList.add("tts-focus");
  }
}
function coloringCurrentNode(currentNode,prevNode) {
  if (prevNode != undefined && prevNode.classList != undefined) {
    prevNode.classList.remove("tts-focus");
  }
  if (currentNode != undefined && currentNode.classList != undefined) {
    currentNode.classList.add("tts-focus");
  }
  console.log("node", currentNode, currentNode.textContent)
  return currentNode.textContent;
}

function _prepareSpeakButton(speech, phase, onNext) {
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
_init()