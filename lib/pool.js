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
  var Pool = function (elemName, infoMethod) {
    this.poolElements = [];
    this.client = null;
    this.elemName = elemName;
    this.doc = null;
    this.infoMethod = infoMethod;
  };


  // Connected all resources in the pool
  Pool.ALL = -2;
  // Connected user's resources
  Pool.MINE = -3;
  // Connected user's resources and the ones in his group
  Pool.MINE_GROUP = -1;


  /**
   * Fetch all pool_elements in the generic pool
   *
   * @param callback  the callback function(respFlag, respMsg, poolInstance)
   */
  Pool.prototype.info = function (callback) {
    var that = this;
    this.xmlrpcCall(this.client, this.infoMethod, [], function (oneResponse) {
      that.processInfo(oneResponse.getMessage());
      callback(oneResponse.success, oneResponse.msg, that);
    });
  };


  /**
   * Fetch some pool_elements in the generic pool by filter flag and page thing
   *
   * @param filter  the filter flag in [Pool.ALL, Pool.MINE, Pool.MINE_GROUP]
   * @param startId the start id, could be -1
   * @param endId   the end id, could be -1
   * @param callback  the callback function(respFlag, respMsg, poolInstance)
   */
  Pool.prototype.infoByFilterPage = function (filter, startId, endId, callback) {
    var that = this;
    this.xmlrpcCall(this.client, this.infoMethod, [filter, startId, endId],
      function (oneResponse) {
        that.processInfo(oneResponse.getMessage());
        callback(oneResponse.success, oneResponse.msg, that);
      });
  };


  /**
   * Fetch all pool_elements in the generic pool
   *
   * @param callback  the callback function(respFlag, respMsg, poolInstance)
   */
  Pool.prototype.infoAll = function (callback) {
    var that = this;
    this.infoByFilterPage(Pool.ALL, -1, -1, callback);
  };


  /**
   * Fetch my pool_elements in the generic pool
   *
   * @param callback  the callback function(respFlag, respMsg, poolInstance)
   */
  Pool.prototype.infoMine = function (callback) {
    var that = this;
    this.infoByFilterPage(Pool.MINE, -1, -1, callback);
  };


  /**
   * Fetch pool_elements in the group of I'm in in the generic pool
   *
   * @param callback  the callback function(respFlag, respMsg, poolInstance)
   */
  Pool.prototype.infoGroup = function (callback) {
    var that = this;
    this.infoByFilterPage(Pool.MINE_GROUP, -1, -1, callback);
  };

  /**
   * Fill in the doc&poolElements properties by parsing the one-response message
   *
   * @param respMsg   the string value of one-response message
   */
  Pool.prototype.processInfo = function (respMsg) {
    this.doc = new dom.DOMParser().parseFromString(respMsg);
    this.poolElements = select(this.doc, '//' + this.elemName);
  };


  /**
   * The factory method returns a suitable PoolElement object from an 
   * XML node. Each Pool must implement the corresponeding factory method.
   */
  Pool.prototype.factory = function (poolElement) {
    // TODO: not implement
    throw new Error("Not implemented yet");
  };


  Pool.prototype.item = function (index) {
    var poolElement = this.poolElements[index];
    if (poolElement !== null) {
      return this.factory(poolElement);
    }
    return null;
  };


  /**
   * Get the specified pool element with the given id
   *
   * @param id  the id of wanted pool element
   */
  Pool.prototype.getById = function (id) {
    var theElement = null;
    var tmpElement = null;
    for (var i in this.poolElements) {
      tmpElement = this.item[i];
      if (tmpElement.getId() === id) {
        theElement = tmpElement;
        break;
      }
    }
    return theElement;
  };


  /**
   * Perform a xmlrpc call
   * 
   * @param client the Client instance provided by client.js
   * @param infoMethod a action method value
   * @param params  an array of parameters which is an Array object 
   * @param callback  the callback function
   */
  Pool.prototype.xmlrpcCall = function (client, infoMethod, params, callback) {
    client.call(infoMethod, params, callback);
  };

  exports.Pool = Pool;

}());