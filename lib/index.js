/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
var env = {
	connect   : require('vsphere-connect'),
	promise   : require('bluebird'),
	lodash    : require('lodash'),
	pluralize : require('pluralize'),
	ignoreSSL : false,
	clients   : {},
	params    : {
		viserver : 'viserver',
		type     : 'type',
		id       : 'id',
		method   : 'method'
	}
};

//shortcut to vsphere-schema
env.schema   = env.connect.env.schema;

// import modules
env.utils    = require('./utils')(env);
env.helpers  = require('./helpers')(env);
env.methods  = require('./methods')(env);
env.handlers = require('./handlers')(env);
env.routes   = require('./routes')(env);


//return the module
module.exports = {
	type         : 'vsphere-connect-rest',
	version      : '1.0.0',
	env          : env,
	utils        : env.utils,
	options      : env.utils.options,
	addRoutes    : env.routes,
	methods      : env.methods,
	handlers     : env.handlers,
	getClient    : env.handlers.getClient,
	get          : env.handlers.get,
	del          : env.handlers.del
};