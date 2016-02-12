/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {

	// return the function
	return function(args) {
		return args.client.destroy({
			type: args.type,
			id: args.id,
			async: args.async,
			delay: args.delay,
			timeout: args.timeout
		});
	};
};