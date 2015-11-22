
	/*
	*	此文件主要用来返回用户获取的页面，以及其他文件
	*
	*	@ auther Na Chao
	*	@ data 15-11-21
	*/


	// 引用全部会使用到的模块
	var url = require('url'),
		http = require("http");

	var path = require("path");

	// 引用专属功能
	var ux73 = require('./core');
	
	// 创建服务对象
	http.createServer(function(req, res){
		var info = url.parse(req.url, true);	// 用户请求的参数

		if ( req.url =="/favicon.ico" ) {
			return;
		}

		// 打开指定页面
		// console.log(info.pathname);
		ux73.getHtml(info.pathname, function(html, mime, form){
			if ( mime ) 
				res.writeHead(200,{ 'Content-type': mime });
			res.end(html, form);
		});

	}).listen(8080, "localhost");	// 开启服务端口

	// 提示
	console.log('Server...!');