
// 未命名
function Socket () {



	// this.lib = funs;

	// this.socket = null;


	this.gets = [];

	this.sets = [];

	this.opens = [];

	this.closes = [];



	/*
	*  引用node模板
	*  private
	*/
	this.socket = require('socket.io');



	console.log('new lib.socket...');
}


// 初始化
Socket.prototype.init = function (server) {


	var that = this;

	var socket = that.socket.listen(server);

	socket.on('connection', function(res){
		var userkey = res.handshake.headers.cookie,
			key = null;
			
		console.log('-----------------', new Date());
		console.log(userkey);

		if ( userkey.indexOf('ux=') >= 0 ) {
			userkey = userkey.substr(userkey.indexOf('ux=') +3);
		} else {
			userkey = '';
		}

		// 设置获取前端的信息
		for ( key in that.gets ) {
			res.on(key, that.gets[key]);
		}

		// 设置向前端发动信息
		for ( key in that.sets ) {
			res.emit(key, that.sets[key]);
		}

		// 断开执行
		res.on('disconnect', function(data){
			for ( key = 0; key < that.closes.length; key++ ) {
				that.closes[key](userkey);
			}
		});

		// 开启成功执行
		for ( key = 0; key < that.opens.length; key++ ) {
			that.opens[key](userkey);
		}
	});

	return this;
}


// 获取指定的数据
Socket.prototype.get = function ( key, callback ) {
	this.gets[key] = callback;
}


// 设置指定的数据
Socket.prototype.send = function ( key, data ) {
	this.sets[key] = data;
}


// 设置socket开启时需要执行的事件
Socket.prototype.open = function ( callback ) {
	this.opens.push(callback);
}


// 设置指定的数据
Socket.prototype.close = function ( callback ) {
	this.closes.push(callback);
}













module.exports = new Socket();




