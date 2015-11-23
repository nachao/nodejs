
// 数据库管理
function DataManagement () {

	// this.connection = null;

	this.connection = this.initMysql();
}


// 编码为md5
DataManagement.prototype.md5 = function ( value ) {
	var Buffer = require("buffer").Buffer;
	var buf = new Buffer(value);
	var str = buf.toString("binary");
	var crypto = require("crypto");
	return crypto.createHash("md5").update(str).digest("hex");
}


// 链接数据库
DataManagement.prototype.initMysql = function () {
	var mysql = require('mysql'),
		connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'nachao',
			database : 'ux73'
		});
		connection.connect(function(err) {
			if (err) {
				console.error('mysql no!: ' + err.stack);
			} else {
				console.log('Mysql...!');
			}
		});

	this.connection = connection;
	return connection;
}


// 根据key获取用户信息
DataManagement.prototype.userSelectByKey = function ( key, callback ) {
	var sql = "SELECT `key`, `name`, `sum` FROM ux73.user where `key` = '"+ key +"';";
	this.connection.query(sql, function(err, rows) {
		if (err)
			console.log(err);
		else
			if ( callback )
				callback(rows[0]);
	});
}


// 判断用户是的存在，如果存在则返回用户信息
DataManagement.prototype.userSelect = function ( account, callback ) {
	var sql = "SELECT `key`, `name`, `sum` FROM ux73.user where `name` = '"+ account +"';";
	this.connection.query(sql, function(err, rows) {
		if (err)
			console.log(err);
		else
			if ( callback )
				callback(rows[0]);
	});
}


// 设置用户状态
DataManagement.prototype.setUserStatus = function ( key, status, callback ) {
	var sql = "UPDATE `ux73`.`user` SET `status`='"+ status +"' WHERE `key`='"+ key +"';";
	this.connection.query(sql, function(err, rows) {
		if (err)
			console.log(err);
		else
			if ( callback )
				callback();
	});
}


// 创建用户
DataManagement.prototype.userCreate = function ( account, callback ) {
	var time = new Date().getTime(),
		user = {
			key: this.md5(String(time)),
			name: account,
			sum: 100,
		},
		sql = "INSERT INTO `ux73`.`user` (`key`, `name`, `sum`, `create_time`) VALUES ('"+ user.key +"', '"+ user.name +"', '"+ user.sum +"', '"+ time +"');"
	this.connection.query(sql, function(err) {
		if (err)
			console.log(err);
		else
			callback(user);
	});
}





module.exports = new DataManagement();