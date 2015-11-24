
/*
*	此文件主要用来返回用户获取的页面，以及其他文件
*
*	@ auther Na Chao
*	@ data 15-11-21
*/

function ServerWeb () {



	this.lib = {};

	this.lib.c001 = require('./libc.001');	// --
	
	// 引用专属功能
	this.comm = require('./core');



	this.init();

}


ServerWeb.prototype.init = function(first_argument) {

	// 引用全部会使用到的模块
	var url = require('url');

	var http = require("http");

	var that = this;

	// 创建服务对象
	var server = http.createServer(function(req, res){
		var info = url.parse(req.url, true);	// 用户请求的参数

		if ( req.url =="/favicon.ico" ) {
			return;
		}

		// 打开指定页面
		that.getHtml(info.pathname, function(html, mime, form){
			if ( mime ) 
				res.writeHead(200,{ 'Content-type': mime });
			res.end(html, form);
		});

	}).listen(8080, "localhost");	// 开启服务端口

	this.lib.c001.socket(server);

	// 提示
	console.log('Server...!');
};


// 主要用户 server - web
// 获取页面
ServerWeb.prototype.getHtml = function ( name, callback ) {

	var that = this,
		fs = require('fs'),
		file = this.comm.getFilePath(name);

	fs.exists(file.name, function(exists){
		if ( exists ) {
			fs.readFile( file.name, file.form, function(err, result){
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
