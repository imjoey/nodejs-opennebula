var xmlrpc = require('xmlrpc');
var select = require('xpath.js');
var dom = require('xmldom');

// Creates an XML-RPC client. Passes the host information on where to
// make the XML-RPC calls.
var client = xmlrpc.createClient('http://10.1.81.235:2633/RPC2');


// Sends a method call to the XML-RPC server
client.methodCall('neo.hostpool.info', ['neoadmin:33333sdsf'], function (error, value) {
  // Results of the method response
  var doc = new dom.DOMParser().parseFromString(value[1]);
  var nodes = select(doc, "HOST");
  for (var i in nodes) {
    console.log(nodes[i].localName + ": " + nodes[i].firstChild.data);
    console.log("node: " + nodes[i].toString());  
  }
});

