// nodejs-oca
// a Host class
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  var poolElement = require('../pool_element');

  var Host = function (client) {
    this.client = client;
  };

  Host.prototype = new poolElement.PoolElement();

  /**
   * Constants for host xmlrpc action methods
   */
  Host.METHOD_PREFIX  = 'host.';
  Host.ALLOCATE       = Host.METHOD_PREFIX + 'allocate';
  Host.INFO           = Host.METHOD_PREFIX + 'info';
  Host.DELETE         = Host.METHOD_PREFIX + 'delete';
  Host.ENABLE         = Host.METHOD_PREFIX + 'enable';
  Host.UPDATE         = Host.METHOD_PREFIX + 'update';
  Host.MONITORING     = Host.METHOD_PREFIX + 'monitoring';


  Host.allocate = function (client, hostname, im, vmm, vnm, clusterId, callback) {
    var params = [hostname, im, vmm, vnm, clusterId];
    client.call(Host.ALLOCATE, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };


  /**
   * Fetch the details of a host instance
   *
   * @param id  the id of host
   * @param callback  a callback funtion(respFlag, respMsg, hostInstance)
   */
  Host.prototype.info = function (id, callback) {
    var params = [id];
    var that = this;
    this.client.call(Host.INFO, params, function (oneResponse) {
      that.processInfo(oneResponse);
      callback(oneResponse.success, oneResponse.msg, that);
    });
  };

  Host.prototype.getXml = function () {
    return this.xml;
  };

  exports.Host = Host;

}());