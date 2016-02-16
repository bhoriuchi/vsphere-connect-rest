/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	var utils = env.utils;
	
	return function(app) {
		
		// reset params to default
		utils.setParams({
			viserver : 'viserver',
			type     : 'type',
			id       : 'id',
			method   : 'method'
		});
		
		
		// add routes
		app.get('/:viserver/:type', env.handlers.get);
		app.get('/:viserver/:type/:id', env.handlers.get);
		app.post('/:viserver/:type/:id/:method', env.handlers.method);
		
		
		if (typeof(app['delete']) === 'function') {
			app['delete']('/:viserver/:type/:id', env.handlers.del);
		}
		else {
			app.del('/:viserver/:type/:id', env.handlers.del);
		}
	};
	
};