
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
	var that = this;

	// 创建服务对象
	var server = that.lib.http.createServer(function(req, res){
		var info = that.lib.url.parse(req.url, true);	// 用户请求的参数

		if ( req.url =="/favicon.ico" ) {
			return;
		}

		// 打开指定页面
		that.getHtml(info.pathname, function(html, mime, form){
			if ( mime ) 
				res.writeHead(200,{ 'Content-type': mime });
			res.end(html, form);
		});


	// 开启服务端口
	}).listen(8080, "localhost", function(){
		console.log('localhost:8080...');

		// 开启功能
		that.lib.ux001.init(server);

		that.lib.ux002.init();
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
