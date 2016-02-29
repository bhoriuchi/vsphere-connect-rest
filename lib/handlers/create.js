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
	var connect = env.connect;
	
	// return the function
	return function(req, res, next) {
		
		// get the client
		env.handlers.getClient(req).then(function(client) {

			var op;
			var type    = utils.getObjectType(client, req.params[env.params.type]);
			var _async  = (req.query.async === 'false') ? false : (env._async || null);
			var delay   = !isNaN(req.query.delay) ? parseInt(req.query.delay, 10) : (env._delay || null);
			var timeout = !isNaN(req.query.timeout) ? parseInt(req.query.timeout, 10) : (env._timeout || null);
			
			
			// create an args object
			var args = {
				client  : client,
				type    : type,
				async   : _async,
				delay   : delay,
				timeout : timeout
			};
			
			
			if (_.includes(['Datacenter'], type)) {
				args.type = type;
				args.name = req.body.name;
				op = env.methods.create.simple(args);
			}
			else if (_.has(env.methods.create, type)){
				op = env.methods.create[type](args);
			}
			else {
				utils.send(res, 405, 'Method not allowed');
				return next();
			}
			
			// execute the create and return the results
			op.then(function(result) {
				
				// if the result is an error, throw it
				if (_.has(result, 'errorCode')) {
					throw result;
				}
				
				// otherwise send the result
				res.send(connect.env.format(result));
				return next();
			})
			.caught(function(err) {
				utils.send(res, (err.errorCode || 500), err);
				return next();
			});
		});
	};
};