// nodejs-oca
// a VirtualMachine class
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  var poolElement = require('../pool_element');

  /**
   * Constructor method
   * @param {Client} client An instance of Client class
   */
  var VirtualMachine = function (client) {
    this.client = client;
  };

  VirtualMachine.prototype = new poolElement.PoolElement();

  /**
   * Constants for vm xmlrpc action methods
   */
  VirtualMachine.METHOD_PREFIX = 'vm.';
  VirtualMachine.ALLOCATE = VirtualMachine.METHOD_PREFIX + 'allocate';
  VirtualMachine.INFO = VirtualMachine.METHOD_PREFIX + 'info';
  VirtualMachine.DEPLOY = VirtualMachine.METHOD_PREFIX + 'deploy';
  VirtualMachine.ACTION = VirtualMachine.METHOD_PREFIX + 'action';
  VirtualMachine.MIGRATE = VirtualMachine.METHOD_PREFIX + 'migrate';
  VirtualMachine.SAVEDISK = VirtualMachine.METHOD_PREFIX + 'savedisk';
  VirtualMachine.CHOWN = VirtualMachine.METHOD_PREFIX + 'chown';
  VirtualMachine.CHMOD = VirtualMachine.METHOD_PREFIX + 'chmod';
  VirtualMachine.MONITORING = VirtualMachine.METHOD_PREFIX + 'monitoring';
  VirtualMachine.ATTACH = VirtualMachine.METHOD_PREFIX + 'attach';
  VirtualMachine.DETACH = VirtualMachine.METHOD_PREFIX + 'detach';

  /**
   * vm state strings
   * @type {Array}
   */
  VirtualMachine.VM_STATES = ['INIT', 'PENDING', 'HOLD', 'ACTIVE', 'STOPPED',
    'SUSPENDED', 'DONE', 'FAILED', 'POWEROFF'];

  /**
   * vm state strings for short
   * @type {Array}
   */
  VirtualMachine.SHORT_VM_STATES = ['init', 'pend', 'hold', 'actv', 'stop',
    'susp', 'done', 'fail', 'poff'];

  /**
   * vm LCM state strings
   * @type {Array}
   */
  VirtualMachine.LCM_STATES = ['LCM_INIT', 'PROLOG', 'BOOT', 'RUNNING', 'MIGRATE',
    'SAVE_STOP', 'SAVE_SUSPEND', 'SAVE_MIGRATE', 'PROLOG_MIGRATE', 'PROLOG_RESUME',
    'EPILOG_STOP', 'EPILOG', 'SHUTDOWN', 'CANCEL', 'FAILURE', 'CLEANUP', 'UNKNOWN',
    'HOTPLUG', 'SHUTDOWN_POWEROFF', 'BOOT_UNKNOWN', 'BOOT_POWEROFF', 'BOOT_SUSPENDED',
    'BOOT_STOPPED'];

  /**
   * vm LCM state strings for short
   * @type {Array}
   */
  VirtualMachine.SHORT_LCM_STATES = [null, 'prol', 'boot', 'runn', 'migr',
    'save', 'save', 'save', 'migr', 'prol', 'epil', 'epil', 'shut', 'shut',
    'fail', 'clea', 'unkn', 'hotp', 'poff', 'boot', 'boot', 'boot', 'boot'];

  /**
   * Class method to allocate a new VM instance
   * @param  {Client}   client   [description]
   * @param  {String}   desc     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.allocate = function (client, desc, callback) {
    var params = [desc];
    client.call(VirtualMachine.ALLOCATE, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Fetch the details of a vm instance
   * @param  {Number}   id       [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.info = function (id, callback) {
    var params = [id];
    var that = this;
    this.client.call(VirtualMachine.INFO, params, function (oneResponse) {
      that.processInfo(oneResponse.getMessage());
      callback(oneResponse.success, oneResponse.msg, that);
    });
  };

  /**
   * Chown the vm instance
   * @param  {Number}   uid      [description]
   * @param  {Number}   gid      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.chown = function (uid, callback) {
    var gid = -1;
    if (arguments.length === 3) {
      gid = Number(arguments[1]);
    }
    var params = [this.getId(), uid, gid];
    this.client.call(VirtualMachine.CHOWN, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Change the permisstions of a vm instance, two ways:
   * The first is to pass through parameters below:
   *   @param  {[type]}   owner_u  1 to allow, 0 deny, -1 do not change
   *   @param  {[type]}   owner_m  1 to allow, 0 deny, -1 do not change
   *   @param  {[type]}   owner_a  1 to allow, 0 deny, -1 do not change
   *   @param  {[type]}   group_u  1 to allow, 0 deny, -1 do not change
   *   @param  {[type]}   group_m  1 to allow, 0 deny, -1 do not change
   *   @param  {[type]}   group_a  1 to allow, 0 deny, -1 do not change
   *   @param  {[type]}   other_u  1 to allow, 0 deny, -1 do not change
   *   @param  {[type]}   other_m  1 to allow, 0 deny, -1 do not change
   *   @param  {[type]}   other_a  1 to allow, 0 deny, -1 do not change
   *   @param  {Function} callback If an error occurs, callback to resolve it
   *   @return {[type]}            [description]
   * The parameters of the other is:
   *   @param  {[string]}   octet    unix permisstion represention, eg: '421', '755'
   *   @param  {Function}   callback [description]
   *   @return {[type]}              [description]
   *   
   */
  VirtualMachine.prototype.chmod = function () {
    if (arguments.length === 10) {
      this.chmod_base(VirtualMachine.CHMOD, arguments[0], arguments[1],
        arguments[2], arguments[3], arguments[4], arguments[5], arguments[6],
        arguments[7], arguments[8], function (oneResponse) {
          arguments[9](oneResponse.success, oneResponse.msg);
        });
    } else if (arguments.length === 2) {
      this.chmod_base(VirtualMachine.CHMOD, arguments[0], function (oneResponse) {
        arguments[1](oneResponse.success, oneResponse.msg);
      });
    }
  };

  /**
   * Monitor a vm instance
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.monitoring = function (callback) {
    var params = [this.getId()];
    this.client.call(VirtualMachine.MONITORING, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Attach a disk to a running vm
   * @param  {Number}    id           The vm id
   * @param  {String} diskTemplate The literal represention of disk template
   * @param  {Function} callback     [description]
   * @return {[type]}                [description]
   */
  VirtualMachine.prototype.attachdisk = function (diskTemplate, callback) {
    var params = [this.getId(), diskTemplate];
    this.client.call(VirtualMachine.ATTACH, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Detach a disk to a running vm
   * @param  {Number}   diskId   [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.detachdisk = function (diskId, callback) {
    var params = [this.getId(), diskId];
    this.client.call(VirtualMachine.DETACH, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Migrate the vm to the target host (hostId)
   * @param  {Number}    hostId   The target host id
   * @param  {Boolean}   live     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.migrate = function (hostId, live, callback) {
    var params = [this.getId(), hostId, live];
    this.client.call(VirtualMachine.MIGRATE, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Set the sepecified vm's disk to be saved in a new image
   * @param  {Number}      diskId    The disk id
   * @param  {String}   imageName The name of new image that will be created
   * @param  {String}   imageType The type of image
   * @param  {Function}   callback  [description]
   * @return {[type]}             [description]
   */
  VirtualMachine.prototype.savedisk = function (diskId, imageName, callback) {
    var imageType = '';
    if (arguments.length === 4) {
      imageType = arguments[2];
    }
    var params = [this.getId(), diskId, imageName, imageType];
    this.client.call(VirtualMachine.SAVEDISK, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Change the group
   * @param  {Number}   gid      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.chgrp = function (gid, callback) {
    this.chown(-1, gid, callback);
  };

  /**
   * Submit an action to be performed on the vm
   * @param  {[type]}   action   [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.__action = function (action, callback) {
    var params = [action, this.getId()];
    this.client.call(VirtualMachine.ACTION, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Shutdown a vm
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.shutdown = function (callback) {
    var params = [this.getId()];
    this.__action('shutdown', callback);
  };

  /**
   * Poweroff a vm
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.poweroff = function (callback) {
    var params = [this.getId()];
    this.__action('poweroff', callback);
  };

  VirtualMachine.prototype.getXml = function () {
    return this.xml;
  };

  exports.VirtualMachine = VirtualMachine;

}());