import ext from "./utils/ext";
import Readability from 'readability';

var extractTags = () => {
  var url = document.location.href;
  if(!url || !url.match(/^http/)) return;

  var data = {
    title: "",
    description: "",
    url: document.location.href
  }

  var ogTitle = document.querySelector("meta[property='og:title']");
  if(ogTitle) {
    data.title = ogTitle.getAttribute("content")
  } else {
    data.title = document.title
  }

  var descriptionTag = document.querySelector("meta[property='og:description']") || document.querySelector("meta[name='description']")
  if(descriptionTag) {
    data.description = descriptionTag.getAttribute("content")
  }
  var documentClone = document.cloneNode(true);
  var article = new Readability(documentClone).parse();
  /*
  This article object will contain the following properties:

    title: article title
    content: HTML string of processed article content
    length: length of an article, in characters
    excerpt: article description, or short excerpt from the content
    byline: author metadata
    dir: content direction

   */
  return article;
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractTags())
  }
}

ext.runtime.onMessage.addListener(onRequest);