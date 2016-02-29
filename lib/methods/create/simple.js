/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	var op;
	
	return function(args) {
		
		if (args.type === 'Datacenter') {
			op = args.client.method('CreateDatacenter', {
				_this: args.client.serviceContent.rootFolder,
				name: args.name
			});
		}
		
		return op;
	};
};