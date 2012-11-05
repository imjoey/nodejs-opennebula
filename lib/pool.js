// nodejs-oca
// abstract Pool class
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  var select = require('xpath.js');
  var dom = require('xmldom');

  /**
   * Create a common Pool object for all elements
   * @constructor
   */
  var Pool = function (elemName, client) {
    this.poolElements = [];
    this.client = client;
    this.elemName = elemName;
    this.doc = null;
  };


  // Connected all resources in the pool
  Pool.prototype.ALL = -2;
  // Connected user's resources
  Pool.prototype.MINE = -3;
  // Connected user's resources and the ones in his group
  Pool.prototype.MINE_GROUP = -1;



  Pool.prototype.processInfo = function (oneResponse) {
    this.doc = new dom.DOMParser().parseFromString(oneResponse.getMessage());
    this.poolElements = select(this.doc, '//' + this.elemName);
  };

  Pool.prototype.xpath = function (doc, elemName) {
    return select(doc, '//' + elemName);
  };

  Pool.prototype.factory = function (poolElement) {
    // TODO: not implement
    throw new Error("Not implemented yet");
  };



}());