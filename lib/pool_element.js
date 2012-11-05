// nodejs-oca
// abstract PoolElement class
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  var select = require('xpath.js');
  var dom = require('xmldom');

  var PoolElement = function (client) {
    this.id = 0;
    this.client = client;
    this.xml = null;
  };

  PoolElement.prototype.setId = function (id) {
    this.id = id;
  };

  PoolElement.prototype.processInfo = function (oneResponse) {
    this.xml = new dom.DOMParser().parseFromString(oneResponse.getMessage());
  };

  PoolElement.prototype.xpath = function (elemName) {
    return select(this.xml, elemName);
  };

  PoolElement.prototype.id = function () {
    return Number(this.xpath('ID'));
  };

  PoolElement.prototype.state = function () {
    return Number(this.xpath('STATE'));
  };

  PoolElement.prototype.getName = function () {
    return this.xpath('NAME');
  };

  /**
   * Return the owner User's ID, or -1 if the element doesn't have one
   */
  PoolElement.prototype.uid = function () {
    var uidStr = this.xpath('UID');
    if (uidStr !== null) {
      return Number(uidStr);
    }
    return -1;
  };

  /**
   * Return the element group's ID, or -1 if the element doesn't have one
   */
  PoolElement.prototype.gid = function () {
    var gidStr = this.xpath('GID');
    if (gidStr !== null) {
      return Number(gidStr);
    }
    return -1;
  };

}());