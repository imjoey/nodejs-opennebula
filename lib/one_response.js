// nodejs-oca
// a one response for nodejs oca library
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  /**
   * Creates a one response to indicate the responeded message
   * @constructor
   * @param {Boolean} success  - if xmlrpc call success
   * @param {String}  message  - the returned message from xmlrpc interface
   */
  var OneResponse = function (success, message) {
    this.success = success;
    this.msg = message;
  };

  OneResponse.prototype.isError = function () {
    return !this.success;
  };

  OneResponse.prototype.getErrorMessage = function () {
    return this.success ? null : this.msg;
  };

  OneResponse.prototype.getMessage = function () {
    return this.success ? this.msg : null;
  };

  OneResponse.prototype.getIntMessage = function () {
    try {
      return Number(this.msg);
    } catch (err) {
      console.error(err);
      return -1;
    }
  };

  exports.OneResponse = OneResponse;

}());