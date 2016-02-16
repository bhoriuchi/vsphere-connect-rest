var vsphere    = require('../lib');

var utils = vsphere.utils;


var obj = {
	USER: {
		configuration : {
			option1: 1,
			pending_task: {
				id: 1
			}
		}
	}	
};


//console.log(utils.rxHas(obj, 'user.config.pending', 'i'));
var schema = vsphere.env.schema['5.5'];


var path = utils.rxHas(schema, [
	new RegExp('^' + 'Folder' + '$', 'i'),
	/^methods$/i,
	new RegExp('^' + 'remove' + '(_.+)?$', 'i')
]);

console.log(path);

console.log(schema.Folder.methods);