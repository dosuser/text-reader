import ext from "./utils/ext";
const readability = require('readability-nodejs')

var extractTags = () => {
  var url = document.location.href;
  if(!url || !url.match(/^http/)) return;

  var data = {
    title: document.title,
    description: "",
    content:"",
    url: document.location.href,
    raw:""
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
    try {
      var documentClone = document.cloneNode(true);
      var documentRaw = document.cloneNode(true);
      let reader = new readability.Readability(documentClone);
      var article = reader.parse(documentClone);
      if(article != null) {
        data.content = article.content;
        data.content = article.content;
        if(documentRaw.documentElement.outerHTML != undefined || documentRaw.documentElement != null){
          data.raw = documentRaw.documentElement.outerHTML
        }else {
          //
          data.raw = documentRaw.innerHTML;
        }
      }

    } catch (e) {
      data.description = JSON.stringify(e)
    }

  /*
  This article object will contain the following properties:

    title: article title
    content: HTML string of processed article content
    length: length of an article, in characters
    excerpt: article description, or short excerpt from the content
    byline: author metadata
    dir: content direction

   */
  //return article;
  return data;
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractTags())
  }
}

ext.runtime.onMessage.addListener(onRequest);