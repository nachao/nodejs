

function Ux () {


	this.connection = null;

	this.users = {};


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
Ux.prototype.saveUserData = function ( userinfo ) {
	if ( typeof(userinfo) == 'object' && userinfo.key ) {
		this.users[userinfo.key] = userinfo;
	}
}


// Local - 将服务器中的用户信息清掉
Ux.prototype.deleteUserData = function ( userkey ) {
	if ( typeof(userkey) == 'string' ) {
		this.users[userkey] = null;
	}
}


// 获取指定用户数据
Ux.prototype.getUserData = function ( userkey ) {
	return this.users[userkey];
}



// 遍历成功数据
Ux.prototype.getSuccessData = function ( data ) {
	return JSON.stringify({
		status: 200,
		data: data,
		msg: 'success'
	});
}


// 遍历成功数据
Ux.prototype.getErrerData = function ( data ) {
	return JSON.stringify({
		status: 404,
		data: '',
		msg: 'errer'
	});
}


// 处理文件路径
Ux.prototype.getFilePath = function ( name ) {
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

module.exports = new Ux();