/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
var vsphere    = require('../lib');
var express    = require('express');
var server     = express();

// optionally set a credential to bypass basic auth
//vsphere.setCredential('administrator@vsphere.local', 'password');

//set the options
vsphere.options({
	ignoreSSL: true,
	exclusive: true,
	params: {
		viserver: 'myViserver',
		type: 'myType',
		id: 'myId',
		method: 'myMethod'
	}
});

// create routes
server.get('/:myViserver/:myType', vsphere.get);
server.get('/:myViserver/:myType/:myId', vsphere.get);
server['delete']('/:myViserver/:myType/:myId', vsphere.del);


// start the server
server.listen(8080, function() {
	console.log('Started express server');
});