// nodejs-oca
// a VirtualMachine class
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  var poolElement = require('../pool_element');

  /**
   * Constructor method
   * @param {[Client]} client An instance of Client class
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
   * @param  {[Client]}   client   [description]
   * @param  {[String]}   desc     [description]
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
   * @param  {[int]}   id       [description]
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
   * @param  {[int]}   id       [description]
   * @param  {[int]}   uid      [description]
   * @param  {[int]}   gid      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.chown = function (id, uid, gid, callback) {
    var params = [id, uid, gid];
    this.client.call(VirtualMachine.CHOWN, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Change the permisstions of a vm instance, two ways:
   * The first is to pass through parameters below:
   *   @param  {[int]}    id       The vm id
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
   *   @param  {[int]}      id       The poolElement id
   *   @param  {[string]}   method   Xmlrpc method name
   *   @param  {[string]}   octet    unix permisstion represention, eg: '421', '755'
   *   @param  {Function}   callback [description]
   *   @return {[type]}              [description]
   *   
   */
  VirtualMachine.prototype.chmod = function () {
    if (arguments.length === 11) {
      this.chmod(arguments[0], VirtualMachine.CHMOD, arguments[1], arguments[2],
        arguments[3], arguments[4], arguments[5], arguments[6], arguments[7],
        arguments[8], arguments[9], function (oneResponse) {
          arguments[10](oneResponse.success, oneResponse.msg);
        });
    } else if (arguments.length === 3) {
      this.chmod(arguments[0], VirtualMachine.CHMOD, arguments[1], function (oneResponse) {
        arguments[2](oneResponse.success, oneResponse.msg);
      });
    }
  };

  /**
   * Monitor a vm instance
   * @param  {[int]}    id       The vm id
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.monitoring = function (id, callback) {
    var params = [id];
    this.client.call(VirtualMachine.MONITORING, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Detach a disk to a running vm
   * @param  {[int]}    id           The vm id
   * @param  {[string]} diskTemplate The literal represention of disk template
   * @param  {Function} callback     [description]
   * @return {[type]}                [description]
   */
  VirtualMachine.prototype.attachdisk = function (id, diskTemplate, callback) {
    var params = [id, diskTemplate];
    this.client.call(VirtualMachine.DETACH, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Migrate the vm to the target host (hostId)
   * @param  {[int]}    hostId   The target host id
   * @param  {[bool]}   live     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  VirtualMachine.prototype.migrate = function (hostId, live, callback) {
    var params = [hostId, live];
    this.client.call(VirtualMachine.MIGRATE, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };

  /**
   * Set the sepecified vm's disk to be saved in a new image
   * @param  {[int]}      diskId    The disk id
   * @param  {[string]}   imageName The name of new image that will be created
   * @param  {Function}   callback  [description]
   * @return {[type]}             [description]
   */
  VirtualMachine.prototype.savedisk = function (diskId, imageName, callback) {
    var params = [diskId, imageName];
    this.client.call(VirtualMachine.SAVEDISK, params, function (oneResponse) {
      callback(oneResponse.success, oneResponse.msg);
    });
  };



  VirtualMachine.prototype.getXml = function () {
    return this.xml;
  };

  exports.VirtualMachine = VirtualMachine;

}());