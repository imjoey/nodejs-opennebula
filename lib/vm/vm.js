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


  VirtualMachine.prototype.getXml = function () {
    return this.xml;
  };

  exports.VirtualMachine = VirtualMachine;

}());