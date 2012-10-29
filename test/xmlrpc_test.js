var xmlrpc = require('xmlrpc')

// Creates an XML-RPC client. Passes the host information on where to
// make the XML-RPC calls.
var client = xmlrpc.createClient({ host: '10.1.81.235', port: 2633, path: '/RPC2'})

console.log('++++++++++++++++++++');

// Sends a method call to the XML-RPC server
client.methodCall('neo.hostpool.info', ['neoadmin:33333sdsf'], function (error, value) {
  // Results of the method response
  console.log('Method response for Action: ' + value[1]);
})

