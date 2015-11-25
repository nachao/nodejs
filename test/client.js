
	// 模拟客户端

	// var http = require('http');

	// var options = {
	// 		hostname: 'localhost',
	// 		port: '1337',
	// 		path: '/',
	// 		method: 'GET'
	// 	};

	// // for ( var i =0 ;i < 10 ;i++ ) {

	// var request = http.request(options, function(res){
	// 		res.on('data', function(chunk){
	// 			console.log('响应内容：', chunk.toString());
	// 		})
	// 	});

	// request.end();	// 结束请求
	// }


	var net = require('net');

	var client = new net.Socket();

	client.connect(1337, 'localhost');


	client.setEncoding('utf8');

	client.on('connect', function(){
		console.log('与服务器连接成功');
	});

	client.on('data', function(data){
		console.log('服务端信息：', data);
	});

	client.write('你好');



	