
var hostlib = require('../lib/host/host');
var clientlib = require('../lib/client');

var client = new clientlib.Client('neoadmin:encyptedpasswd', 'http://10.1.81.235:2633/RPC2');

var host = new hostlib.Host(client);

host.info(0, function (success, msg, host) {
  console.log(host.getId());
  console.log(host.getState());
});