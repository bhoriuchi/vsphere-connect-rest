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
	var schema  = env.schema;
	var Promise = env.promise;
	var connect = env.connect;
	
	// return the function
	return function(args) {

		var version = args.client.apiVersion;
		
		// get the path
		var path = utils.rxHas(schema[version], [
		    new RegExp('^' + args.type + '$', 'i'),
		    /^methods$/i,
		    new RegExp('^' + args.method + '(_.+)?$', 'i')
		]);
		
		if (!path) {
			return new Promise(function(resolve, reject) {
				reject({
					errorCode: 400,
					message: 'vSphere method not allowed'
				});
			});
		}
		
		// get the method name
		var methodName = _.last(path.split('.'));
		
		// get the arguments of the method
		var method  = _.get(schema[version], path);
		var params  = _.cloneDeep(_.get(method, 'params'));
		
		// store the fields to omit and the missing required fields
		var omits   = [];
		var missing = [];

		// update the params attributes if possible
		_.forEach(params, function(v, k) {
			if (k !== '_this') {
				
				if (!_.has(args.body, k) && v.required) {
					missing.push(k);
				}
				else if (!_.has(args.body, k) && !v.required) {
					omits.push(k);
				}
				else {
					params[k] = args.body[k];
				}
			}
		});
		
		// if _this is a param, add it
		if (_.has(params, '_this')) {
			params._this = connect.util.moRef(args.type, args.id);
		}
		
		// check for deprecated methods
		if (method.deprecated) {
			return new Promise(function(resolve, reject) {
				reject({
					errorCode: 400,
					message: 'This method has been deprecated' + 
					((method.deprecated === true) ? '' : ', use ' + method.deprecated + ' instead')
				});
			});
		}
		else if (missing.length > 0) {
			return new Promise(function(resolve, reject) {
				reject({
					errorCode: 400,
					message: 'Missing required parameters ' + missing.join(', ')
				});
			});
		}

		// execute the method
		return args.client.method(methodName, _.omit(params, omits))
		.then(function(result) {
			
			if (args.async === false) {
				// determine if the task should be monitored or reference returned
				return args.client.monitor.taskAsync(args, result);	
			}
			return connect.env.format(result);
		});
	};
};