/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	var _       = env.lodash;
	var connect = env.connect;
	var utils   = env.utils;
	var Promise = env.promise;
	var STATUS  = connect.env.statics.status;
	
	// return the function
	return function(args) {
		
		// set properties
		args.autoLogin = true;
		args.ignoreSSL = (args.ignoreSSL === true) ? true : ((env.ignoreSSL === true) ? true : false);
		args.exclusive = (args.exclusive === true) ? true : ((env.exclusive === true) ? true : false);
		args.maxRetry  = args.maxRetry || env.maxRetry;
		
		// optional arguments
		if (!args.events && env.events) {
			args.events = env.events;
		}
		
		// look for credentials
		if (!args.sessionid && !args.username) {
			return new Promise(function(resolve, reject) {
				reject({
					errorCode: 401,
					message: 'No credentials were provided'
				});
			});
		}
		else if (!args.host) {
			return new Promise(function(resolve, reject) {
				reject({
					errorCode: 400,
					message: 'No host specified'
				});
			});
		}
		
		
		// look for a client
		var client = _.get(env.clients, args.host + '.' + args.username.toLowerCase());
		
		// check for no client or a client that is not connected and not reconnecting
		if (!client || (client.status !== STATUS.CONNECTED && client.status !== STATUS.RECONNECTING)) {
			
			// create a new client
			return connect.createClient(args).then(function(client) {
				utils.mapObjectsToPath(client);
				_.set(env.clients, args.host + '.' + args.username.toLowerCase(), client);
				return client;
			});
		}
		else {
			return new Promise(function(resolve, reject) {
				resolve(client);
			});
		}
	};
};