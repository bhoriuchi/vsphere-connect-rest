/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	// return the function
	return function(client, type, id, properties) {
			
		// create an args object
		var args = { type: type };
		
		// if there are properties or all properties is requested, add a properties arg
		if ((Array.isArray(properties) && properties.length > 0) || properties === 'all') {
			args.properties = properties;
		}
		
		// if there is an id, add it as an array
		if (id) {
			args.id = Array.isArray(id) ? id : [id];
		}
		
		// perform the managed object search
		return client.retrieve(args);
	};
};