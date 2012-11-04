var xml = require('node-xml');

var host = {};

var parser = new xml.SaxParser(function (cb) {
  var current;
  cb.onStartDocument(function () {
    console.log('start to parse xml document');
  });
  cb.onEndDocument(function () {
    console.log('finish the xml document parsing');
  });
  cb.onStartElementNS(function (elem, attrs, prefix, uri, namespaces) {
    current = elem;
  });
  cb.onEndElementNS(function (elem, prefix, uri) {
  });
  cb.onCharacters(function (chars) {
    if (chars !== '') {
      host[current] = chars;
    }
  });
});

parser.parseFile('host.xml');

setTimeout(function () {
  console.log(host);
}, 5000);
