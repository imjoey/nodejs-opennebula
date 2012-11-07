// nodejs-oca
// abstract PoolElement class
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  var select = require('xpath.js');
  var dom = require('xmldom');

  var PoolElement = function (client) {
    this.id = NaN;
    this.client = client;
    this.xml = null;
  };

  PoolElement.prototype.setId = function (id) {
    this.id = id;
  };

  /**
   * Fill in the xml property by parsing the one-response message
   *
   * @param respMsg   the string value of one-response message
   */
  PoolElement.prototype.processInfo = function (respMsg) {
    this.xml = respMsg;
  };

  PoolElement.prototype.xpath = function (elemName) {
    return select(this.xml, elemName);
  };

  PoolElement.prototype.getId = function () {
    var nodes = this.xpath('ID');
    return Number(nodes[0].firstChild.data);
  };

  PoolElement.prototype.getState = function () {
    var state = this.xpath('STATE')[0].firstChild.data;
    return state === null ? -1 : Number(state);
  };

  PoolElement.prototype.getName = function () {
    return this.xpath('NAME')[0].firstChild.data;
  };

  /**
   * Return the owner User's ID, or -1 if the element doesn't have one
   */
  PoolElement.prototype.getUid = function () {
    var uidStr = this.xpath('UID')[0].firstChild.data;
    return uidStr === null ? -1 : Number(uidStr);
  };

  /**
   * Return the element group's ID, or -1 if the element doesn't have one
   */
  PoolElement.prototype.getGid = function () {
    var gidStr = this.xpath('GID')[0].firstChild.data;
    return gidStr === null ? -1 : Number(gidStr);
  };


  PoolElement.prototype.xmlrpcCall = function (action, params, callback) {
    this.client.call(action, params, callback);
  };

  exports.PoolElement = PoolElement;

}());