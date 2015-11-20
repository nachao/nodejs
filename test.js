
	
	function Test () {


		this.connection = this.initMysql();


		this.initServer();

	}


	// 开启服务
	Test.prototype.initServer = function () {
		var that = this,
			http = require('http'),
			url = require('url');

		http.createServer(function(req, res){

			if ( req.url == '/favicon.ico' ) {.
				return false;
			}

			// 用户请求的参数
			var info = url.parse(req.url, true);
			console.log('用户请求的参数', info);

			that.getHtml(info.pathname, function(html){
				res.write(html);

				// 获取操作
				that.getUse(info.query, function(key){
					if ( key == '登录或注册' ) {

						// 获取用户
						that.userSelect(info.query.account, function(data){
							if ( data.length ) {
								console.log('login');
								res.write('<html><p id="userInfo" style="display: none;">'+ JSON.stringify(data) +'</p></html>');
								res.end();
							} else {
								// console.log('register');
								// var time = String(new Date().getTime());
								// console.log(that.md5(time));

								// 创建用户
								that.userCreate(info.query.account, function(){

									// 获取新用户信息
									that.userSelect(info.query.account, function(newData){
										console.log('login', newData);
										res.write('<html>'+ JSON.stringify(newData) +'</html>');
										res.end();
									});
								});
							}
						});
					}
				});
			});

		// 绑定地址和端口
		}).listen(8080, 'localhost');

		// 提示
		console.log('创建服务成功！');
	}


	Test.prototype.md5 = function ( value ) {
		var Buffer = require("buffer").Buffer;
		var buf = new Buffer(value);
		var str = buf.toString("binary");
		var crypto = require("crypto");
		return crypto.createHash("md5").update(str).digest("hex");
	}


	// 获取页面
	Test.prototype.getHtml = function ( name, callback ) {
		var fs = require('fs'),
			that = this;

		if ( name.lastIndexOf('/') == name.length-1 ) {
			name += 'index';
		}
		if ( name.charAt(0) == '/' ) {
			name = name.replace('/', '');
		}
		if ( name.indexOf('.html') < 0 ) {
			name += '.html';
		}

		fs.readFile( name, 'utf8', function(err, result){
			if ( err )
				that.getHtml('404', callback);
			else
				if ( callback )
					callback(result);
		});
	}


	// 获取页面
	Test.prototype.getUse = function ( query, callback ) {
		var result = '';

		for ( key in query ) {
			if ( key == 'account' ) {
				result = '登录或注册';
			}
			if ( key == 'logout' ) {
				result = '注销';
			}
		}

		if ( callback )
			callback(result);
	}


	// 链接数据库
	Test.prototype.initMysql = function () {
		var mysql = require('mysql'),
			connection = mysql.createConnection({
				host     : 'localhost',
				user     : 'root',
				password : 'nachao',
				database : 'ux73'
			});
			connection.connect(function(err) {
				if (err) {
					console.error('数据库链接失败!: ' + err.stack);
				} else {
					console.log('数据库链接成功!');
				}
			});

		return connection;
	}


	// 判断用户是的存在，如果存在则返回用户信息
	Test.prototype.userSelect = function ( account, callback ) {
		var sql = "SELECT * FROM ux73.user where `name` = '"+ account +"';";
		this.connection.query(sql, function(err, rows) {
			if (err)
				console.log(err);
			else
				callback(rows);
		});
	}


	// 创建用户
	Test.prototype.userCreate = function ( account, callback ) {
		var sql = "INSERT INTO `ux73`.`user` (`name`, `sum`) VALUES ('"+ account +"', 100);";
		this.connection.query(sql, function(err, packet) {
			if (err)
				console.log(err);
			else
				callback();
		});
	}


	// 初始化
	new Test();
