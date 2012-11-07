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


  /**
   * Perform xmlrpc call, with processing the response by callback function
   *
   * @param action  the action method name without the 'one'
   * @param other_params  an array of params except authToken, an Array object
   * @param callback  the callback function(oneResponse)
   */
  Client.prototype.call = function (action, other_params, callback) {
    var params = [];
    params[0] = this.oneAuth;
    other_params = other_params || [];
    params = params.concat(other_params);
    var xmlrpcClient = rpc.createClient(this.oneEndPoint);
    console.log('params@xmlprc-call -->> ' + params);
    xmlrpcClient.methodCall('neo.' + action, params, function (error, value) {
      if (error !== null) {
        console.error(error);
      }
      var success = Boolean(value[0]);
      var message = value[1];
      callback(new oneResp.OneResponse(success, message));
    });
  };

  exports.Client = Client;

}());