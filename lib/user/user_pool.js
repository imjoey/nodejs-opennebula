// nodejs-oca
// a UserPool class
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  var poollib = require('../pool');
  var userlib = require('./user');

  var UserPool = function (client) {
    this.client = client;
  };

  /**
   * Constants for hostpool xmlrpc action methods
   */
  UserPool.ELEMENT_NAME = 'USER';
  UserPool.INFO_METHOD  = 'userpool.info';

  UserPool.prototype = new poollib.Pool(UserPool.ELEMENT_NAME,
    UserPool.INFO_METHOD);

  /**
   * [factory description]
   * @param  {[PoolElement]} poolElement [description]
   * @return {[type]}             [description]
   */
  UserPool.prototype.factory = function (poolElement) {
    var user = new userlib.User(this.client);
    user.processInfo(poolElement);
    return user;
  };


  exports.UserPool = UserPool;

}());