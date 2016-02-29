/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	return {
		simple: require('./simple')(env),
		VirtualMachine: require('./VirtualMachine')(env)
	};
};