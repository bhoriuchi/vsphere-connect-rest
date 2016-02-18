/**
 * vSphere Connect REST
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	var path  = env.path;
	var utils = env.utils;
	
	return function(app, options) {
		
		options  = options || {};
		var root = options.rootPath || '';
		root     = '/' + root;
		
		
		// reset params to default
		utils.setParams({
			viserver : 'viserver',
			type     : 'type',
			id       : 'id',
			method   : 'method'
		});
		
		
		// add routes
		app.get(path.normalize(root + '/:viserver/:type'), env.handlers.get);
		app.get(path.normalize(root + '/:viserver/:type/:id'), env.handlers.get);
		app.post(path.normalize(root + '/:viserver/:type/:id/:method'), env.handlers.method);
		
		
		if (typeof(app['delete']) === 'function') {
			app['delete'](path.normalize(root + '/:viserver/:type/:id'), env.handlers.del);
		}
		else {
			app.del(path.normalize(root + '/:viserver/:type/:id'), env.handlers.del);
		}
	};
	
};