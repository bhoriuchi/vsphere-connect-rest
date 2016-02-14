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


console.log(utils.rxHas(obj, 'user.config.pending', 'i'));