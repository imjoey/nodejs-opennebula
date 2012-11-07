var poollib = require('../lib/pool');
var clientlib = require('../lib/client');

var client = new clientlib.Client('neoadmin:hereshouldbencyptedpasswd',
  'http://10.1.81.235:2633/RPC2');

var pool = new poollib.Pool('HOST', client, 'neo.hostpool.info');




pool.xmlrpcCall(client, infoMethod, params, callback)