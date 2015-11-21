
	/*
	*	此文件主要用户前端的Ajax数据请求。
	*
	*	@ auther Na Chao
	*	@ data 15-11-21
	*/



	// 引用全部会使用到的模块
	var url = require('url'),
		http = require("http");

	// 引用专属功能
	var ux = require('./core');

	// 链接数据库
	ux.initMysql();
	
	// 创建服务对象
	http.createServer(function(req, res){
		var info = url.parse(req.url, true);	// 用户请求的参数
		console.log(info);

		if ( req.url =="/favicon.ico" ) {
			return;
		}

		// 说明
		res.writeHead(200, {
			"Content-Type": "text/plain;charset=utf-8",
			"Access-Control-Allow-Origin": "*"
		});

		// 调用专属功能 - 获取并判断用户操作
		ux.getUse(info.query, function(key, account){
			if ( key == '登录或注册' ) {
				ux.userSelect(account, function(data){
					if ( data ) {
						res.write(data);
						res.end();
					} else {
						ux.userCreate(account, function(data){
							res.write(data);
							res.end();
						});
					}
				});
			} else {
				res.write(key);
				res.end();
			}
		});

	}).listen(8081, "localhost");	// 开启服务端口

	// 提示
	console.log('Ajax...!');