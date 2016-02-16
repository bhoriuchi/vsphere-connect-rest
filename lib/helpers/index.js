/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	// create a new object
	env.helpers           = env.helpers || {};
	
	// import the helpers
	env.helpers.folder    = require('./folder')(env);

	
	// return the handler object
	return env.helpers;
};