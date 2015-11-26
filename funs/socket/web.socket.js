
// 未命名
function Socket () {

	this.lib = funs;

	this.socket = io.connect('localhost:8080');
}


// 初始化
Socket.prototype.init = function () {

	// var socket = io.connect('localhost:8080');

	// socket.on('disconnect', function(){
	// 	console.log('与服务器断开连接');
	// });

	// return socket;
}


// 获取指定的数据
Socket.prototype.get = function ( key, callback ) {
	this.socket.on(key, callback);
}


// 设置指定的数据
Socket.prototype.set = function ( key, data ) {
	this.socket.emit(key, data);
}

















