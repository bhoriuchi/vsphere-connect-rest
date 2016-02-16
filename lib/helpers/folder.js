/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {

	var connect = env.connect;
	var _       = env.lodash;
	var Promise = env.promise;
	var utils   = env.utils;
	
	// return the function
	return function(args) {

		var prop;
		
		if (args.datacenter && !args.folder) {
			
			if (args.type === 'Datastore') {
				prop = 'datastoreFolder';
			}
			else if (args.type === 'HostSystem' || args.type === 'ClusterComputeResource') {
				prop = 'hostFolder';
			}
			else if (args.type === 'Network' || args.type === 'DistributedVirtualPortgroup' || args.type === 'VmwareDistributedVirtualSwitch') {
				prop = 'networkFolder';
			}
			else if (args.type === 'VirtualMachine') {
				prop = 'vmFolder';
			}
			else {
				throw {
					errorCode: 400,
					message: 'Invalid root folder type'
				};
			}
			
			return args.client.retrieve({
				type: 'Datacenter',
				id: args.datacenter,
				properties: [prop]
			})
			.then(function(dc) {
				
				if (dc.length > 0) {
					return dc[0][prop];
				}
				
				throw {
					errorCode: 404,
					message: 'Datacenter not found'
				};
			});
		}
		else {
			return new Promise(function(resolve, reject) {
				resolve(args.folder);
			});
		}
	};
};