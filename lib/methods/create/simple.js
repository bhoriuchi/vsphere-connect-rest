/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	var _       = env.lodash;
	var Promise = env.promise;
	
	return function(args) {
		
		// vCenter level objects can be Datacenter or Folder. Allow default
		// to rootFolder all other objects will need to have a root object
		if (_.includes(['Datacenter', 'Folder'], args.type)) {
			return env.helpers.folder(args.body).then(function(folder) {
				return args.client.method('Create' + args.type, {
					_this: folder || args.client.serviceContent.rootFolder,
					name: args.body.name
				});
			});
		}
		
		// return a rejected promise
		return new Promise(function(resolve, reject) {
			reject({
				errorCode: 500,
				message: 'unknown error'
			});
		});
	};
};