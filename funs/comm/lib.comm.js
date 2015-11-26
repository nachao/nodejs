

function Comm () {

	this.users = {};

	console.log('new lib.comm...');
}


// 编码为md5
Comm.prototype.md5 = function ( value ) {
	var Buffer = require("buffer").Buffer;
	var buf = new Buffer(value);
	var str = buf.toString("binary");
	var crypto = require("crypto");
	return crypto.createHash("md5").update(str).digest("hex");
}


// Local - 将用户信息保存到服务器
Comm.prototype.saveUserData = function ( userinfo ) {
	if ( typeof(userinfo) == 'object' && userinfo.key ) {
		this.users[userinfo.key] = userinfo;
	}
}


// Local - 将服务器中的用户信息清掉
Comm.prototype.deleteUserData = function ( userkey ) {
	if ( typeof(userkey) == 'string' ) {
		this.users[userkey] = null;
	}
}


// 获取指定用户数据
Comm.prototype.getUserData = function ( userkey ) {
	return this.users[userkey];
}



// 遍历成功数据
Comm.prototype.successData = function ( data ) {
	return {
		status: 200,
		msg: 'success',
		data: data
	};
}


// 遍历成功数据
Comm.prototype.errerData = function ( data ) {
	return {
		status: 404,
		msg: 'errer',
		data: ''
	};
}


// 遍历成功数据为JSON
Comm.prototype.successJSON = function ( data ) {
	return JSON.stringify(this.successData(data));
}


// 遍历成功数据为JSON
Comm.prototype.errerJSON = function ( data ) {
	return JSON.stringify(this.errerData(data));
}


// 处理文件路径
Comm.prototype.getFilePath = function ( name ) {
	var path = require("path"),
		mime = '';
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
	if ( path.basename(name) == 'socket.io.js' ) {
		name = '../' + name;
	} 
	
	name = '../' + name;

	return {
		name: name,
		mime: mime,
		form: form
	}
}

module.exports = new Comm();