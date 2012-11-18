// nodejs-oca
// a User class
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {
  var poolElement = require('../pool_element');

  /**
   * Contructor method
   * @param {Client} client [description]
   */
  var User = function (client) {
    this.client = client;
  };

  /**
   * Make User class extends PoolElement class
   */
  User.prototype = new poolElement.PoolElement();

  /**
   * Constants for user xmlrpc action methods
   */
  User.METHOD_PREFIX  = 'user.';
  User.ALLOCATE       = User.METHOD_PREFIX + 'allocate';
  User.INFO           = User.METHOD_PREFIX + 'info';
  User.DELETE         = User.METHOD_PREFIX + 'delete';
  User.UPDATE         = User.METHOD_PREFIX + 'update';
  User.PASSWD         = User.METHOD_PREFIX + 'passwd';
  User.CHGRP          = User.METHOD_PREFIX + 'chgrp';
  User.CHAUTH         = User.METHOD_PREFIX + 'chath';
  User.QUOTA          = User.METHOD_PREFIX + 'quota';

  User.allocate = function (client, username, password, callback) {
    var params = [username, password];
    client.call(User.ALLOCATE, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Fetch the details of a user instance
   * @param  {[type]}   id       [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  User.prototype.info = function (id, callback) {
    var params = [id];
    var that = this;
    this.client.call(User.INFO, params, function (oneResponse) {
      that.processInfo(oneResponse.getMessage());
      callback(oneResponse.success, oneResponse.msg, that);
    });
  };

  /**
   * Delete the user instance
   * @param  {int}   id       [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  User.prototype.delete = function (id, callback) {
    var params = [id];
    this.client.call(User.DELETE, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Change the password of the user instance
   * @param  {int}   id       [description]
   * @param  {int}   password [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  User.prototype.passwd = function (id, password, callback) {
    var params = [id, password];
    this.client.call(User.PASSWD, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Change the main group of the user instance
   * @param  {int}   id       [description]
   * @param  {int}   gid      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  User.prototype.chgrp = function (id, gid, callback) {
    var params = [id, gid];
    this.client.call(User.CHGRP, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Change the auth driver and the password of the user instance
   * @param  {int}   id       [description]
   * @param  {string}   auth     [description]
   * @param  {string}   password [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  User.prototype.chauth = function (id, auth, password, callback) {
    var params = [id, auth, password];
    this.client.call(User.CHAUTH, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Replace the user instance template contents
   * @param  {int}   id           [description]
   * @param  {string}   new_template [description]
   * @param  {Function} callback     [description]
   * @return {[type]}                [description]
   */
  User.prototype.update = function (id, new_template, callback) {
    var params = [id, new_template];
    this.client.call(User.UPDATE, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Replace the user instance quota template content
   * @param {int}   id             [description]
   * @param {string}   quota_template [description]
   * @param {Function} callback       [description]
   */
  User.prototype.set_quota = function (id, quota_template, callback) {
    var params = [id, quota_template];
    this.client.call(User.QUOTA, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Return true if the user instance is enabled
   * @return {Boolean}            If the user is enabled
   */
  User.prototype.enabled = function () {
    var enabled = this.xpath('ENABLED')[0].firstChild.data;
    return enabled !== null && Number(enabled) === 1;
  };

}());