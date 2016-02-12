/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {

	var _        = env.lodash;
	var utils    = env.utils;
	var handlers = env.handlers;
	var methods  = env.methods;
	
	// return the function
	return function(req, res, next) {
		
		// get the client
		handlers.getClient(req).then(function(client) {
			
			// get the fields requested
			var properties, fields = [];
			
			var type = utils.getObjectType(client, req.params[env.params.type]);
			var id   = req.params[env.params.id] || null;
			
			// validate that the object is a valid type
			if (!type) {
				utils.send(res, 404, req.params[env.params.type] + ' is not a valid object type');
				return next();
			}

			// determine the fields to use
			if (req.query.fields === 'all') {
				fields = 'all';
			}
			else if (typeof(req.query.fields) === 'string') {
				fields = req.query.fields.split(',');
			}
			else if (Array.isArray(req.query.fields)) {
				fields = req.query.fields;
			}
			
			// build an args object
			var args = {
				client: client,
				type: type,
				id: id,
				fields: fields,
				properties: properties
			};
			
			// look for search
			if (_.has(req.query, 'search.field') && _.has(req.query, 'search.value')) {
				args.search = {
					field: req.query.search.field,
					value: req.query.search.value
				};
			}
			
			// begin method
			return methods.get(args).then(function(results) {
				
				// if the result is an error, throw it
				if (_.has(results, 'errorCode')) {
					throw results;
				}
				
				// otherwise send the result
				res.send(utils.page(req, results));
				return next();
			})
			.caught(function(err) {
				utils.send(res, (err.errorCode || 500), err);
				return next();
			});
		})
		.caught(function(err) {
			utils.send(res, (err.errorCode || 500), err);
			return next();
		});
	};
};