/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	var _      = env.lodash;
	var utils  = env.utils;
	var schema = env.schema;
	
	// return the function
	return function(req, res, next) {

		// get the client
		env.handlers.getClient(req).then(function(client) {
			
			// look for the schema object
			var type = utils.getObjectType(client, req.params[env.params.type]);
			var s = _.get(schema[client.apiVersion], type);
			
			// if the schema doesnt exist return a 404
			if (!s) {
				utils.send(res, 404, {
					errorCode: 404,
					message: 'Not Found'
				});
				return next();
			}
			
			// otherwise send the schema
			res.send(s);
			return next();
		});
	};
};