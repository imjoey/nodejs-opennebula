

var hostpoollib = require('../lib/host/host_pool');
var clientlib = require('../lib/client');

var client = new clientlib.Client('neoadmin:encyptedpasswd', 'http://10.1.81.235:2633/RPC2');

var hostPool = new hostpoollib.HostPool(client);

hostPool.info(function (respFlag, respMsg, hostpool) {
  console.log(respFlag);
  var host = hostpool.item(1);
  console.log(host.getName());
});