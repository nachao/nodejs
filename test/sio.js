
	var sio = require('socket.io');

	var http = require('http');

	var fs = require('fs');

	var path = require('path');

	var server = http.createServer(function(req, res){

			if ( req.url == '/favicon.ico' ) {
				return;
			} 

			console.log(req.url);

			if ( path.extname(req.url) == '.js' ) {
				res.writeHead(200, {'Content-type': 'application/x-javascript' });
				res.end(fs.readFileSync('../../node_modules/socket.io/node_modules/socket.io-client/socket.io.js'));
			} else {
				res.writeHead(200, {'Content-type': 'text/html' });
				res.end(fs.readFileSync('t.html'));
			}
		}).listen('1337', 'localhost');

	var socket = sio.listen(server);

	var number = 0;	// 当前连接人数。

	var info = {};

	var text = '';

	socket.on('connection', function(res){

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



		res.on('disconnect', function(){
			number -= 1;
			console.log('客户端断开连接');

			res.broadcast.emit('say success', '当前用户在线数量：'+ number);
		});

		res.on('save user', function(userinfo){
			if ( typeof(userinfo) == 'object' && userinfo.key ) {
				info[userinfo.key] = userinfo;
				res.emit('send nickname', userinfo);
			}
		});

		res.on('get user', function(key){
			if ( typeof(key) == 'string' && info[key] ) {
				res.emit('send nickname', info[key]);
			} else {
				res.emit('send nickname', '未找到');
			}
		});


		// res.send('当前用户在线数量：'+ number);


		console.log('客户端建立连接');
		res.emit('say success', '当前用户在线数量：'+ number);
		res.broadcast.emit('say success', '当前用户在线数量：'+ number);
	});

	// socket.on('message', function(msg){
	// 	console.log(msg);
	// 	socket.send(msg);
	// });