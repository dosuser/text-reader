const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const tts = require('./hello.js')


var contents = fs.readFileSync('test/sample/kafka.html', 'utf8');
const dom = new JSDOM(contents);
document =dom.window.document


tts.initRange()


tts.next( null , function (t) {
  console.log(t)
  tts.next( null , function (t) {
    console.log(t)
  })

})





