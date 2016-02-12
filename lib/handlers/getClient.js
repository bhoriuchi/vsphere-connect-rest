/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	var _       = env.lodash;
	var utils   = env.utils;
	var methods = env.methods;
	
	// return the function
	return function(req) {
		
		var host = req.params[env.params.viserver];
		host     = host ? host.toLowerCase() : null;
		
		var ignoreSSL = (req.query.ignoressl === 'true') ? true : false;
		ignoreSSL     = (env.ignoreSSL === true) ? true : ignoreSSL;
		
		// get the credential
		var cred      = env.credential || utils.decryptBasicAuth(req.headers.authorization);
		var sessionId = env.sessionid || req.query.sessionid || null;

		// create an args object
		var args = {
			host      : host,
			username  : cred.username,
			password  : cred.password,
			ignoreSSL : ignoreSSL,
			sessionId : sessionId
		};
		
		// return the method to get the client
		return methods.getClient(args);
	};
};