var nodes;
function initRange() {
  nodes = document.getElementsByTagName("p");
}
function next(e , callback) {
  ttsPosition++;
  var phase = coloringCurrentNode(nodes[ttsPosition], nodes[ttsPosition-1]);
  while(checkSkip(phase.textContent)){
    phase = coloringCurrentNode(nodes[ttsPosition], nodes[ttsPosition-1]);
  }
  ;
  if(callback != undefined){
    callback(phase)
  }
}
var ttsPosition = 0;
function coloringCurrentNode(currentNode,prevNode) {
  if (prevNode != undefined && prevNode.classList != undefined) {
    prevNode.classList.remove("tts-focus");
  }
  if (currentNode != undefined && currentNode.classList != undefined) {
    currentNode.classList.add("tts-focus");
  }
  console.log("node", currentNode, currentNode.textContent)
  // currentNode.scrollIntoView()
  // window.scrollBy(0, -200); // Adjust scrolling with a negative value here
  return currentNode;
}

function checkSkip(targetText) {
  if(targetText.indexOf("src") >= 0){
    return true;
  }

  return false;

}

exports.checkSkip = checkSkip
exports.coloringCurrentNode = coloringCurrentNode
exports.next = next
exports.initRange = initRange