
/*
*	此文件主要用来返回用户获取的页面，以及其他文件
*
*	@ auther Na Chao
*	@ data 15-11-21
*/

function ServerWeb () {


	this.lib = require('../funs');


	/*
	* 	引用自定义公共模板
	*
	*	private
	*/
	// this.lib.comm = require('../funs/comm/lib.comm');

	// this.lib.user = require('../funs/user/lib.user');

	// this.lib.mysql = require('../funs/mysql/lib.mysql');

	// this.lib.socket = require('../funs/socket/lib.socket');


	// this.lib.sio = require('socket.io');

	console.log(this.lib.a);



	this.init();

	console.log('node web...');
}


ServerWeb.prototype.init = function(first_argument) {


	var that = this,
		server = this.lib.http.createServer();

	// 绑定端口
	server.listen(8080, 'localhost');

	// 服务开启成功
	server.on('listening', function(){
		console.log('localhost:8080...');

		var socket = that.lib.socket.init(server);

		/*
		var socket = that.lib.sio.listen(server);

		socket.on('connection', function(res){

			// for ( var key in that.get ) {
			// 	res.on(key, that.get[key]);
			// }

			// for ( var key in that.set ) {
			// 	res.emit(key, that.set[key]);
			// }


			// 离开提示
			res.on('disconnect', function(data){
				// console.log(res.handshake.headers.cookie);
				console.log('---- connection ---- close');
			});

			// 链接提示
			console.log('---- connection ---- open');
			// res.send('welcome to 001.');
		});
*/

		// 开启功能
		that.lib.ux001.init(socket);

		that.lib.ux002.init(socket);
	});

	// 处理客户端请求
	server.on('request', function(req, res){

		var info = that.lib.url.parse(req.url, true);	// 用户请求的参数

		if ( req.url !== "/favicon.ico" ) {
			that.getHtml(info.pathname, function(html, mime, form){		// 打开指定页面
				if ( mime ) {
					res.writeHead(200,{ 'Content-type': mime });
				}
				res.end(html, form);
			});
		}
	});
};


// 主要用户 server - web
// 获取页面
ServerWeb.prototype.getHtml = function ( name, callback ) {

	var that = this,
		file = that.lib.comm.getFilePath(name);

	that.lib.fs.exists(file.name, function(exists){
		if ( exists ) {
			that.lib.fs.readFile( file.name, file.form, function(err, result){
				if ( err )
					that.getHtml('/errer', callback);
				else if ( callback ) 
					callback(result, file.mime, file.form);
			});
		} else if ( callback ) {
			callback('<html>404</html>');
		}
	});
}



module.exports = new ServerWeb();
