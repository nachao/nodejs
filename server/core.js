

function Ux73 () {


	this.connection = null;


	// this.initServer();

}

/*
// 开启服务
Ux73.prototype.initServer = function () {
	var that = this,
		http = require('http'),
		url = require('url');

	http.createServer(function(req, res){

		if ( req.url == '/favicon.ico' ) {
			return false;
		}

		// 用户请求的参数
		var info = url.parse(req.url, true);
		console.log('用户请求的参数', info);

		that.getHtml(info.pathname, function(html){

			res.writeHead(200,{
				'Content-type': 'text/' + path.extname(name).replace('.', '')
			});
			res.write(html);

			// 获取操作
			that.getUse(info.query, function(key){
				if ( key == '登录或注册' ) {
					that.userSelect(info.query.account, function(data){	// 获取用户
						if ( data.length ) {
							// console.log('login');
							// res.write('<html><p id="userInfo" style="display: none;">'+ JSON.stringify(data) +'</p></html>');
							res.end();
						} else {
							// console.log(that.md5(String(new Date().getTime())));
							that.userCreate(info.query.account, function(){				// 创建用户
								that.userSelect(info.query.account, function(newData){	// 获取新用户信息
									// console.log('login', newData);
									// res.write('<html>'+ JSON.stringify(newData) +'</html>');
									res.end();
								});
							});
						}
					});
				} else {
					res.end();
				}
			});
		});

	// 绑定地址和端口
	}).listen(8080, 'localhost');

	// 提示
	console.log('创建服务成功！');
}
*/


Ux73.prototype.md5 = function ( value ) {
	var Buffer = require("buffer").Buffer;
	var buf = new Buffer(value);
	var str = buf.toString("binary");
	var crypto = require("crypto");
	return crypto.createHash("md5").update(str).digest("hex");
}


// 获取页面
Ux73.prototype.getHtml = function ( name, callback ) {
	var that = this,
		fs = require('fs'),
		path = require("path"),
		mime = '',
		form = '';

	if ( name.charAt(name.length-1) == '/' ) {
		name += 'index';
	}
	if ( name.charAt(0) == '/' ) {
		name = name.replace('/', '');
	}
	if ( path.extname(name) == '' ) {
		name += '.html';
	}
	if ( path.extname(name) == '.js' ) {
		mime = 'application/x-javascript';
	}
	if ( path.extname(name) == '.css' ) {
		mime = 'text/css';
	}
	if ( path.extname(name) == '.jpg' ) {
		mime = 'image/jpeg';
		form = 'binary';
	}
	
	name = '../' + name;

	fs.exists(name, function(exists){
		// console.log(name, mime, form, exists);
		if ( exists ) {
			fs.readFile( name, form, function(err, result){
				if ( err )
					that.getHtml('/errer', callback);
				else if ( callback ) 
					callback(result, mime, form);
			});
		} else if ( callback ) {
			callback('<html>404</html>');
		}
	});
}


// 获取页面
Ux73.prototype.getUse = function ( query, callback ) {
	var result = '未知操作';

	for ( key in query ) {
		if ( key == 'account' ) {
			result = '登录或注册';
			if ( callback )
				callback(result, query.account);
		}
		if ( key == 'logout' ) {
			result = '注销';
		}
	}
}


// 链接数据库
Ux73.prototype.initMysql = function () {
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


// 判断用户是的存在，如果存在则返回用户信息
Ux73.prototype.userSelect = function ( account, callback ) {
	var sql = "SELECT `key`, `name`, `sum` FROM ux73.user where `name` = '"+ account +"';";
	this.connection.query(sql, function(err, rows) {
		if (err)
			console.log(err);
		else
			if ( callback )
				callback(JSON.stringify(rows[0]));
	});
}


// 创建用户
Ux73.prototype.userCreate = function ( account, callback ) {
	var time = new Date().getTime(),
		user = {
			key: this.md5(String(time)),
			name: account,
			sum: 100,
		},
		sql = "INSERT INTO `ux73`.`user` (`key`, `name`, `sum`, `time`) VALUES ('"+ user.key +"', '"+ user.name +"', '"+ user.sum +"', '"+ time +"');"
	this.connection.query(sql, function(err) {
		if (err)
			console.log(err);
		else
			callback(JSON.stringify(user));
	});
}

module.exports = new Ux73();

