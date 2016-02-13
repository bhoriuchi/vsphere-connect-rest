/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	var _     = env.lodash;
	var utils = env.utils;
	
	// return the function
	return function(req, res, next) {
		
		// get the client
		env.handlers.getClient(req).then(function(client) {
			
			// determine the type and id
			var type    = utils.getObjectType(client, req.params[env.params.type]);
			var id      = req.params[env.params.id];
			var _async  = (req.query.async === 'false') ? false : (env._async || null);
			var delay   = !isNaN(req.query.delay) ? parseInt(req.query.delay, 10) : (env._delay || null);
			var timeout = !isNaN(req.query.timeout) ? parseInt(req.query.timeout, 10) : (env._timeout || null);
			
			// create an args object
			var args = {
				client  : client,
				type    : type,
				id      : id,
				async   : _async,
				delay   : delay,
				timeout : timeout
			};
			
			// execute the delete and return the results
			env.methods.del(args).then(function(result) {
				
				// if the result is an error, throw it
				if (_.has(result, 'errorCode')) {
					throw result;
				}
				
				// otherwise send the result
				res.send(result);
				return next();
			})
			.caught(function(err) {
				utils.send(res, (err.errorCode || 500), err);
				return next();
			});
		});
	};
};