// nodejs-oca
// abstract PoolElement class
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  var select = require('xpath.js');
  var dom = require('xmldom');

  var PoolElement = function (client) {
    this.id = NaN;
    this.client = client;
    this.xml = null;
  };

  /**
   * Fill in the xml property by parsing the one-response message
   *
   * @param respMsg   the string value of one-response message
   */
  PoolElement.prototype.processInfo = function (respMsg) {
    this.xml = respMsg;
  };

  PoolElement.prototype.xpath = function (elemName) {
    return select(this.xml, elemName);
  };

  PoolElement.prototype.getId = function () {
    var nodes = this.xpath('ID');
    return Number(nodes[0].firstChild.data);
  };

  PoolElement.prototype.getState = function () {
    var state = this.xpath('STATE')[0].firstChild.data;
    return state === null ? -1 : Number(state);
  };

  PoolElement.prototype.getName = function () {
    return this.xpath('NAME')[0].firstChild.data;
  };

  /**
   * private method to change the permisstions of a poolElement instance by bools
   * @param  {[string]} method   Xmlrpc method name
   * @param  {[type]}   owner_u  1 to allow, 0 deny, -1 do not change
   * @param  {[type]}   owner_m  1 to allow, 0 deny, -1 do not change
   * @param  {[type]}   owner_a  1 to allow, 0 deny, -1 do not change
   * @param  {[type]}   group_u  1 to allow, 0 deny, -1 do not change
   * @param  {[type]}   group_m  1 to allow, 0 deny, -1 do not change
   * @param  {[type]}   group_a  1 to allow, 0 deny, -1 do not change
   * @param  {[type]}   other_u  1 to allow, 0 deny, -1 do not change
   * @param  {[type]}   other_m  1 to allow, 0 deny, -1 do not change
   * @param  {[type]}   other_a  1 to allow, 0 deny, -1 do not change
   * @param  {Function} callback If an error occurs, callback to resolve it
   * @return {[type]}            [description]
   */
  PoolElement.prototype.__chmod_ogo = function (id, method, owner_u, owner_m, owner_a,
    group_u, group_m, group_a, other_u, other_m, other_a, callback) {
    var params = [id, owner_u, owner_m, owner_a, group_u, group_m, group_a, other_u,
      other_m, other_a];
    this.client.call(method, params, callback);
  };

  /**
   * private method to change the permisstions of a poolElement instance by octet
   * @param  {[int]}      id       The poolElement id
   * @param  {[string]}   method   Xmlrpc method name
   * @param  {[string]}   octet    unix permisstion represention, eg: '421', '755'
   * @param  {Function}   callback [description]
   * @return {[type]}              [description]
   */
  PoolElement.prototype.__chmod_octet = function (id, method, octet, callback) {
    var owner_u = (Number(octet.slice(0, 1)) & 4) !== 0 ? 1 : 0;
    var owner_m = (Number(octet.slice(0, 1)) & 2) !== 0 ? 1 : 0;
    var owner_a = (Number(octet.slice(0, 1)) & 1) !== 0 ? 1 : 0;
    var group_u = (Number(octet.slice(1, 2)) & 4) !== 0 ? 1 : 0;
    var group_m = (Number(octet.slice(1, 2)) & 2) !== 0 ? 1 : 0;
    var group_a = (Number(octet.slice(1, 2)) & 1) !== 0 ? 1 : 0;
    var other_u = (Number(octet.slice(2, 3)) & 4) !== 0 ? 1 : 0;
    var other_m = (Number(octet.slice(2, 3)) & 2) !== 0 ? 1 : 0;
    var other_a = (Number(octet.slice(2, 3)) & 1) !== 0 ? 1 : 0;
    this.__chmod_bool(method, id, owner_u, owner_m, owner_a, group_u, group_m,
      group_a, other_u, other_m, other_a, callback);
  };

  /**
   * Change the permission of a poolElement instance
   * @return {[type]} [description]
   */
  PoolElement.prototype.chmod_base = function () {
    if (arguments.length === 11) {
      // call __chmod_ogo
      this.__chmod_ogo(this.getId(), arguments[0], arguments[1], arguments[2],
        arguments[3], arguments[4], arguments[5], arguments[6], arguments[7],
        arguments[8], arguments[9], arguments[10]);
    } else if (arguments.length === 3) {
      // call __chmod_octet
      this.__chmod_octet(this.id, arguments[0], arguments[1], arguments[2]);
    }
  };

  /**
   * Return the owner User's ID, or -1 if the element doesn't have one
   */
  PoolElement.prototype.getUid = function () {
    var uidStr = this.xpath('UID')[0].firstChild.data;
    return uidStr === null ? -1 : Number(uidStr);
  };

  /**
   * Return the element group's ID, or -1 if the element doesn't have one
   */
  PoolElement.prototype.getGid = function () {
    var gidStr = this.xpath('GID')[0].firstChild.data;
    return gidStr === null ? -1 : Number(gidStr);
  };


  PoolElement.prototype.xmlrpcCall = function (action, params, callback) {
    this.client.call(action, params, callback);
  };

  exports.PoolElement = PoolElement;

}());