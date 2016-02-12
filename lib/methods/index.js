/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	// create a new object
	env.methods           = env.methods || {};
	
	// import the handlers
	env.methods.getEntity = require('./getEntity')(env);
	env.methods.getClient = require('./getClient')(env);
	env.methods.get       = require('./get')(env);
	env.methods.del       = require('./del')(env);
	
	// return the handler object
	return env.methods;
};