/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	var _         = env.lodash;
	var pluralize = env.pluralize;
	

	// overrides default param values for routes
	function setParams(overrides) {
		_.merge(env.params, overrides);
	}

	
	// set a global credential to use to bypass basic auth
	function setCredential(username, password) {
		env.credential = {
			username: username,
			password: password
		};
	}


	// express and restify do not have the same syntax for a one
	// line response with code, so this emulates that for both
	function send(res, status, body) {
		
		// check for express
		if (typeof(res.sendStatus) === 'function') {
			res.status(status).send(body);
		}
		else {
			res.send(status, body);
		}
	}


	// decrypt the basic authentication header into a username/password
	function decryptBasicAuth(auth) {

		var buf     = new Buffer(auth.replace(/^Basic\s/, ''), 'base64');
		var authArr = buf.toString().split(':');
		
		if (authArr.length === 2) {
			return {
				username: authArr[0],
				password: authArr[1]
			};	
		}
		return null;
	}


	// create a rest compliant resource path and map it back to the object type
	function mapObjectsToPath(client) {
		client.schema      = env.connect.env.schema.utils.getSchema(client.apiVersion);
		client.objectPaths = {};
		_.forEach(client.schema, function(v, k) {
			client.objectPaths[pluralize(k.toLowerCase())] = k;
		});
	}


	// get the object type
	function getObjectType(client, type) {
		if (_.has(client.schema, type)) {
			return type;
		}
		else if (_.has(client.objectPaths, type.toLowerCase())) {
			return client.objectPaths[type.toLowerCase()];
		}
		else {
			return null;
		}
	}
	
	// ignore SSL
	function ignoreSSL(bool) {
		if (typeof(bool) === 'boolean') {
			env.ignoreSSL = bool;
		}
		else {
			env.ignoreSSL = true;
		}
	}
	
	
	// return a page
	function page(req, results) {

		if (!Array.isArray(results)) {
			return results;
		}
		
		var offset = !isNaN(req.query.offset) ? parseInt(req.query.offset, 10) : 0;
		var limit  = !isNaN(req.query.limit)  ? parseInt(req.query.limit, 10)  : 100;
		limit      = (req.query.limit === 'false') ? results.length : limit;
		offset     = (offset === -1) ? (results.length - limit) : offset;
		
		if (limit < 1) {
			throw {
				code: 416,
				message: 'Unacceptable limit parameter specified'
			};
		}
		if (offset < 0 || (offset > results.length - 1)) {
			throw {
				code: 416,
				message: 'Unacceptable offset parameter specified'
			};
		}
		
		return results.slice(offset, limit + offset);
	}
	
	// set client options
	function options(opts) {
		
		if (opts.ignoreSSL === true) {
			env.ignoreSSL = true;
		}
		if (opts.exclusive === true) {
			env.exclusive = true;
		}
		if (_.has(opts, ['credential.username', 'credential.password'])) {
			env.credential = opts.credential;
		}
		if (opts.sessionid) {
			env.sessionid = opts.sessionid;
		}
		if (opts.maxRetry) {
			env.maxRetry = opts.maxRetry;
		}
		if (opts.events) {
			env.events = opts.events;
		}
		if (opts.params) {
			setParams(opts.params);
		}
		if (opts.async) {
			env._async = opts.async;
		}
		if (typeof(opts.delay) === 'number' && opts.delay > 0) {
			env._delay = opts.delay;
		}
		if (typeof(opts.timeout) === 'number' && opts.timeout > 0) {
			env._timeout = opts.timeout;
		}
	}
	
	
	// regular expression find
	function rxFind(obj, rx, flags, findKey) {
		
		// create matches array
		var matches = [];
		
		// use only valid regex flags
		flags = (typeof(flags) === 'string') ? flags.replace(/[^gimuy]/g, '') : undefined;
		
		// if a string is passed, make it a regex
		rx = (typeof(rx) === 'string') ? new RegExp(rx, flags) : rx;
		
		// check that obj is an object and rx is a regexp
		if (_.isObject(obj) && _.isRegExp(rx)) {
			
			// look for results
			_.forEach(obj, function(v, k) {
				if (findKey === true && k.match(rx)) {
					matches.push(k);
				}
				else if (typeof(v) === 'string' && v.match(rx)) {
					matches.push(v);
				}
			});
		}
		
		return matches;
	}
	
	
	function rxHasEx(obj, path, actual, flags) {
		actual = actual || [];
		
		if (path.length > 0) {
			
			var rx = _.isRegExp(path[0]) ? path[0] : new RegExp(path[0], flags);
			
			_.forEach(_.keys(obj), function(k) {
				if (k.match(rx)) {
					
					actual.push(k);
					rxHasEx(obj[k], path.slice(1), actual, flags);
					return false;
				}
			});	
		}
		
		return actual;
	}
	
	// regular expression has
	function rxHas(obj, path, flags) {
		
		// use only valid regex flags
		flags = (typeof(flags) === 'string') ? flags.replace(/[^gimuy]/g, '') : undefined;
		
		// look for required args
		if (obj && path) {
			
			// get an array of path names or rx
			path = Array.isArray(path) ? path : path.split('.');
			
			// get the actual path
			var actual = rxHasEx(obj, path, [], flags);

			
			// if the actual path is the same length as the search path, its a match
			if (actual.length === path.length) {
				
				// return the actual path
				return actual.join('.');
			}	
		}
		
		// otherwise not a match
		return false;
	}

	
	// return the methods
	return {
		rxHas            : rxHas,
		options          : options,
		page             : page,
		ignoreSSL        : ignoreSSL,
		setParams        : setParams,
		setCredential    : setCredential,
		send             : send,
		decryptBasicAuth : decryptBasicAuth,
		mapObjectsToPath : mapObjectsToPath,
		getObjectType    : getObjectType
	};
};