/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {

	var _       = env.lodash;
	var methods = env.methods;
	
	// return the function
	return function(args) {

		// check for a search and add it do the fields since
		// it will be required to actually do the search.
		// searches will also be performed in 2 phases since
		// searching a large collection with many properties
		// will slow performance
		if (_.has(args, 'search.field')) {
			args.fields     = _.union(args.fields, [args.search.field]);
			args.properties = [args.search.field];
		}
		else {
			args.properties = args.fields;
		}
		
		
		// search for the entity or entities
		return methods.getEntity(
			args.client,
			args.type,
			args.id,
			args.properties
		)
		.then(function(results) {
			
			if (!args.id && args.search) {
				
				// create a regex of the search value
				var rx = new RegExp(args.search.value, 'i');
				var matches = [];
				
				// loop throuhgh the results and look for matches
				// compiling a list of ids
				_.forEach(results, function(obj) {
					var prop = _.get(obj, args.search.field);
					if (prop && prop.match(rx)) {
						matches.push(obj.id);
					}
				});
				
				if (matches.length > 0) {
					return methods.getEntity(
						args.client,
						args.type,
						matches,
						args.fields
					)
					.then(function(results) {
						return results;
					});
				}
				else {
					return [];
				}
			}
			else if (!results) {
				throw {
					errorCode: 404,
					message: 'Not Found'
				};
			}

			// if there were results, send them
			return results;
		});
	};
};