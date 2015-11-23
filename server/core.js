

function Ux () {


	this.connection = null;

	this.dm = require('./data_management');	// mysql 数据管理

	this.qb = require('./guess_blindly');	// --


	// this.initServer();

}


// 编码为md5
Ux.prototype.md5 = function ( value ) {
	var Buffer = require("buffer").Buffer;
	var buf = new Buffer(value);
	var str = buf.toString("binary");
	var crypto = require("crypto");
	return crypto.createHash("md5").update(str).digest("hex");
}


// Local - 将用户信息保存到服务器
Ux.prototype.saveUser = function ( userinfo ) {
	if ( typeof(userinfo) == 'object' && userinfo.key ) {
		this.users[userinfo.key] = userinfo;
	}
}


// Local - 将服务器中的用户信息清掉
Ux.prototype.deleteUser = function ( userkey ) {
	if ( typeof(userkey) == 'string' ) {
		this.users[userinfo.key] = null;
	}
}


// 遍历成功数据
Ux.prototype.successData = function ( data ) {
	return JSON.stringify({
		status: 200,
		data: data,
		msg: 'success'
	});
}


// 获取页面
Ux.prototype.getHtml = function ( name, callback ) {
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
		console.log(name, mime, form, exists);
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


// 获取页面，执行相应操作，且返回对应的json
Ux.prototype.getUse = function ( query, callback ) {
	var that = this,
		result = {
			status: 404,
			data: '',
			msg: ''
		};

		callback = callback || $.noop;

	// 缓存登录
	if ( query._ == 'entry' && query.userkey ) {
		that.dm.userSelectByKey(query.userkey, function(data){	// 根据Key获取用户信息
			console.log(data);
			if ( data ) {
				result = that.successData(data);
				that.dm.setUserStatus(query.userkey, '1');		// 设置用户为在线状态
			}
			callback(result);
		});

	// 登录或注册
	} else if ( query._ == 'entry' && query.account ) {
		that.dm.userSelect(query.account, function(data){	// 根据Name获取用户信息
			if ( data ) {
				result.data = data;
				result.status = 200;
				that.dm.setUserStatus(query.userkey, '1');		// 设置用户为在线状态
				callback(JSON.stringify(result));
			} else {
				that.dm.userCreate(query.account, function(data){	// 如果没获取到，则根据给定的账户名创建新账号
					if ( data ) {
						result.data = data;
						result.status = 200;
					}
					callback(JSON.stringify(result));
				});
			}
		});

	// 退出登录
	} else if ( query._ == 'logout' && query.userkey ) {
		that.dm.setUserStatus(query.userkey, '0', function(){
			result.msg = 'success';
			result.status = 200;
			callback(JSON.stringify(result));
		});

	// 进入功能 001
	} else if ( query._ == '001' && query.userkey ) {
		callback(that.successData(that.qb.get()));

	// 操作 001
	} else if ( query._ == '001add' && query.userkey && query.key ) {
		callback(that.successData(that.qb.opt(query.userkey, query.key)));

	// 无对应的后台操作
	} else {
		callback(JSON.stringify(result));
	}
}



module.exports = new Ux();