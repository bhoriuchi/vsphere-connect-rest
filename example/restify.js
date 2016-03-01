/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */

var vsphere    = require('../lib');
var restify    = require('restify');
var server     = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());

// set the options
vsphere.options({
	ignoreSSL            : true,
	exclusive            : true,
	requireForceToDelete : true
});

// use the route generator to add all routes
vsphere.addRoutes(server);

// start the server
server.listen(8080, function() {
	console.log('%s listening at %s', server.name, server.url);
});