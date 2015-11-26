
/*
*	此文件主要用来返回用户获取的页面，以及其他文件
*
*	@ auther Na Chao
*	@ data 15-11-21
*/

function ServerWeb () {


	this.lib = require('../funs');

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

		// 开启功能
		that.lib.ux001.init(server);

		that.lib.ux002.init();
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
