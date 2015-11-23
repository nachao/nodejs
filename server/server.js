
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

	var sio = require('socket.io');
	
	// 创建服务对象
	var server = http.createServer(function(req, res){
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




	var socket = sio.listen(server);

	var number = 0,
		guess = {},
		text = '';

	for ( var i = 1; i <= 9; i++ ) {
		guess[i] = {
			key: i,
			number: 0,
			user: []
		}
	}

	socket.on('connection', function(res){

		// console.log(res);

		res.send('你好');

		number += 1;


		res.on('message', function(msg){
			console.log('接收到一个信息：', msg);
		});

		res.on('say', function(msg){
			text += msg;

			res.emit('say success', text);
			res.broadcast.emit('say success', text);
		});

		res.on('get guess blindly', function(){
			res.emit('send guess blindly', guess[data.key]);
		})

		res.on('disconnect', function(){
			number -= 1;
			console.log('客户端断开连接');
			res.broadcast.emit('say success', '当前用户在线数量：'+ number);
		});

		res.on('opt guess blindly', function(data){
			if ( typeof(data) == 'object' && data.key ) {
				guess[data.key].number += 1;

				if ( guess[data.key].user.indexOf(data.key) < 0 ) {
					guess[data.key].user.push(data.key);
				}

				res.emit('send guess blindly', guess[data.key]);
				res.broadcast.emit('send guess blindly', guess[data.key]);
			}
		})

		res.emit('say success', '当前用户在线数量：'+ number);
		res.broadcast.emit('say success', '当前用户在线数量：'+ number);
	});



	// 提示
	console.log('Server...!');