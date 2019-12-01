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
    raw:"",
    docLang: '',
    docLength:'',
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
        if(article.title){
          data.title = article.title;
        }
        if(article.length){
          data.docLength = article.length;
        }
        if(documentRaw.documentElement.outerHTML != undefined || documentRaw.documentElement != null){
          data.raw = documentRaw.documentElement.outerHTML
          data.docLang = document.getElementsByTagName("html")[0].getAttribute("lang");

          //
        }else {
          //
          data.raw = documentRaw.innerHTML;
        }
      }

    } catch (e) {
      data.description = JSON.stringify(e)
    }

  return data;
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractTags())
  }
}

ext.runtime.onMessage.addListener(onRequest);
/*
readability parse object
    return {
      title: this._articleTitle,
      byline: metadata.byline || this._articleByline,
      dir: this._articleDir,
      content: articleContent.innerHTML,
      textContent: textContent,
      length: textContent.length,
      excerpt: metadata.excerpt,
      siteName: metadata.siteName || this._articleSiteName,
      image: _image,
      images: _images
    };
 */