var select = require('xpath.js');
var dom = require('xmldom');

var xml = "<book><title>Harry Potter</title><title>Voldmod</title></book>";
var doc = new dom.DOMParser().parseFromString(xml);

var nodes = select(doc, "//title");

for (var i in nodes) {
  console.log(nodes[i].localName + ": " + nodes[i].firstChild.data);
  console.log("node: " + nodes[i].toString());  
}
