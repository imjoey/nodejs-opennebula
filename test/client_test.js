var client = require('../lib/client');

var aClient = new client.Client('neoadmin:encyptedpasswd', 'http://10.1.81.235:2633/RPC2');

aClient.call('hostpool.info', [], function (oneResponse) {
  console.log(oneResponse.success);
  console.log(oneResponse.msg);
});