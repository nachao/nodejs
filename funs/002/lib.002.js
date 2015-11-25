
// 挂机
function Ux002 () {


	/*
	*  引用自定义公共模板
	*  private
	*/
	this.lib = {};

	this.lib.comm = require('../comm/lib.comm');

	this.lib.user = require('../user/lib.user');

	this.lib.mysql = require('../mysql/lib.mysql');




	// console.log('Ux002 comm', this.lib.comm);


	console.log('new lib.002...');
}


/*
*  引用自定义公共模板
*
*  private
*/
Ux002.prototype.init = function () {

	console.log('Ux002.prototype.init...');
}







module.exports = new Ux002();

