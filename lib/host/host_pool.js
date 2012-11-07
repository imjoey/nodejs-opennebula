// nodejs-oca
// a HostPool class
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  var poollib = require('../pool');
  var hostlib = require('./host');

  var HostPool = function (client) {
    this.client = client;
  };


  /**
   * Constants for hostpool xmlrpc action methods
   */
  HostPool.ELEMENT_NAME = 'HOST';
  HostPool.INFO_METHOD  = 'hostpool.info';
  HostPool.MONITORING   = 'hostpool.monitoring';


  HostPool.prototype = new poollib.Pool(HostPool.ELEMENT_NAME,
    HostPool.INFO_METHOD);

  /**
   * Factory method to generate an Host instance
   * 
   * @override Pool.factory() method
   */
  HostPool.prototype.factory = function (poolElement) {
    var host = new hostlib.Host(this.client);
    host.processInfo(poolElement);
    return host;
  };

  HostPool.prototype.monitoring = function (callback) {
    this.xmlrpcCall(HostPool.MONITORING, [], function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  exports.HostPool = HostPool;

}());