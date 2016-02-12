/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	// create a new object
	env.handlers           = env.handlers || {};
	
	// import the handlers
	env.handlers.getClient = require('./getClient')(env);
	env.handlers.get       = require('./get')(env);
	env.handlers.del       = require('./del')(env);
	
	// return the handler object
	return env.handlers;
};