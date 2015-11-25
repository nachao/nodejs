
// 未命名
function User () {

	this.param = {};

	this.param.connection = null;


	this.lib = {};

	this.lib.mysql = require('./libc.mysql');	// --


	// 开启数据库
	this.param.connection = this.lib.mysql.init();
}


// 刷新用户积分
// key = 用户key
// num = 设置后的值
User.prototype.setSum = function ( key, num, callback ) {
	var sql = "UPDATE `ux73`.`user` SET `sum`='"+ num +"' WHERE `key`='"+ key +"';";

	this.param.connection.query(sql, function(err) {
		if (err)
			console.log(err);
		else
			if ( callback )
				callback(key, num);
	});
}






module.exports = new User();

