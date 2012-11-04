// nodejs-oca
// a client for nodejs oca library
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  var rpc = require('xmlrpc');
  var oneResp = require('./one_response');

  /**
   * Creates a Client object to call xmlrpc interface
   *
   * @constructor
   * @param {String} secret   - e.g.:username:password 
   * @param {String} endpoint - e.g.: http://localhost:2633/RPC2
   */
  var Client = function (secret, endpoint) {
    this.oneAuth = secret;
    this.oneEndPoint = endpoint;
  };


  Client.prototype.call = function (action, other_params) {
    var params = [];
    params[0] = this.oneAuth;
    params = params.concat(other_params);
    var xmlrpcClient = rpc.createClient(this.oneEndPoint);
    xmlrpcClient.methodCall(action, params, function (error, value) {
      var success = Boolean(value[0]);
      var message = value[1];
      return oneResp.OneResponse(success, message);
    });
  };

  exports.Client = Client;

}());