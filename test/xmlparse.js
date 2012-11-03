var xml = require('node-xml');

var parser = new xml.SaxParser(function (cb) {
  cb.onStartDocument(function () {
    console.log('start to parse xml document');
  });
  cb.onEndDocument(function () {
    console.log('finish the xml document parsing');
  });
  cb.onStartElementNS(function (elem, attrs, prefix, uri, namespaces) {
    console.log('=> Started: ' + elem);
  });
});

parser.parseFile('host.xml');
