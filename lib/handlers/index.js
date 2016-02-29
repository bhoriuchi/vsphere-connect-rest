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
	env.handlers.method    = require('./method')(env);
	env.handlers.get       = require('./get')(env);
	env.handlers.del       = require('./del')(env);
	env.handlers.schema    = require('./schema')(env);
	env.handlers.create    = require('./create')(env);
	
	// return the handler object
	return env.handlers;
};