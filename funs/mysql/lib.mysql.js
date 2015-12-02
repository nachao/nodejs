
// 数据库管理
function Mysql () {

	this.connection = null;

	// this.connection = this.initMysql();

	console.log('new lib.mysql...');
}


// 编码为md5
Mysql.prototype.md5 = function ( value ) {
	var Buffer = require("buffer").Buffer;
	var buf = new Buffer(value);
	var str = buf.toString("binary");
	var crypto = require("crypto");
	return crypto.createHash("md5").update(str).digest("hex");
}


// 链接数据库
Mysql.prototype.init = function ( callback ) {
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
			console.log('Mysql.prototype.init...');
			if ( callback )
				callback(connection);
		}
	});

	this.connection = connection;
	return connection;
}



module.exports = new Mysql();

