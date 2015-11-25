
	// var cp = require('child_process');

	// var process = require('process');

	// var sp1 = cp.spawn('node', ['./test1.js', 'one', 'two', 'three', 'four']);

	// var sp2 = cp.spawn('node', ['./test2.js', JSON.stringify({ key: '123' })], { stdio: 'pipe' });



	// sp1.stdout.on('data', function(data){
	// 	console.log('子进程 1 标准输出：', (data).toString());

	// 	// sp2.stdin.write(data);
	// });

	// // sp1.on('exit', function(code, signal){
	// // 	console.log('子进程 1 退出，退出代码为：', code);
	// // 	process.exit();
	// // });

	// sp2.stdout.on('data', function(data){
	// 	console.log('子进程 2 标准输出：', (data).toString());
	// });


	
	// var http = require('http');

	// var child_process = require('child_process');

	// var cp1 = child_process.fork('test1.js');

	// var cp2 = child_process.fork('test1.js');

	// var server = http.createServer();

	// server.listen(1337, 'localhost', function(){
	// 	// console.log('开启服务');

	// 	cp1.send('server', server);

	// 	cp2.send('server', server);

	// 	console.log('父进程中的服务已创建');

	// 	var tempServer = http.createServer();
			
	// 	tempServer.on('request', function(req, res){
	// 		console.log(req.url);

	// 		for ( var i =0, sum =0; i< 1000000; i++ ) {
	// 			sum += i;
	// 		}

	// 		res.write('客户端请求在父进程中被处理');
	// 		res.end('sum=' + sum);
	// 	});

	// 	tempServer.listen(server);

	// });





	// var child = require('child_process').fork('test1.js');

	// var server = require('net').createServer();

	// server.on('connection', function(socket){

	// 	console.log(socket.remoteAddress);

	// 	// child.send('socket', socket);

	// 	socket.end('客户端请求被父进程处理');

	// });

	// server.listen(1338, 'localhost');




	// var cluster = require('cluster');

	// var http = require('http');

	// if ( cluster.isMaster ) {
	// 	cluster.fork();

	// 	console.log('这段代码被运行在主进程中');
	// } else {
	// 	http.createServer(function(req, res){
	// 		res.writeHead(200, {
	// 			'Content-Type': 'text/html'
	// 		});
	// 		res.write('<head><meta charset="utf-8" /></head>');
	// 		res.end('你好\n');

	// 		console.log('这段代码运行在子进程中');

	// 	}).listen(1337);
	// }

	// cluster.on('fork', function(worker){
	// 	console.log('子进程'+ worker.id +'被开启');
	// });

	// cluster.on('online', function(worker){
	// 	console.log('子进程反馈信息'+ worker.id);
	// });

	// cluster.on('listening', function(worker, address){
	// 	console.log('子进程开始监听：', address.address, address.port);
	// });


	// var cluster = require('cluster');

	// cluster.setupMaster({
	// 	exec: 'test1.js'
	// });

	// cluster.fork();

	// console.log('这段代码被运行在主进程中');

	// console.log('cluster.settings 属性:', cluster.settings);

	
	// var cluster = require('cluster');

	// var http = require('http');

	// var sio = require('socket.io');

	// cluster.setupMaster({
	// 	exec: 'child.js'
	// });

	// var worker = cluster.fork();

	// worker.on('messar')








	// if ( cluster.isMaster ) {
	// 	cluster.fork();
	// 	cluster.fork();
	// }
	// else {
	// 	var server = http.createServer(function(req, res){

	// 		for ( var i =0, sum =0; i< 1000000; i++ ) {
	// 			sum += i;
	// 		}

	// 		res.writeHead(200);
	// 		// res.write('<head><meta charset="utf-8" /></head>');
	// 		res.write('客户端请求在子进程'+ cluster.worker.id +'中被处理');
	// 		res.end('sum:' +  sum);

	// 	}).listen(1337);

	// 	var socket = sio.listen(server);

	// 	socket.on('connection', function(){
	// 		console.log(111);
	// 	});
	// }







	var net = require('net');

	var server = net.createServer();

	server.listen(1337, 'localhost');


	server.on('listening', function(){
		console.log('服务开启', server.address());
	});


	server.on('connection', function(socket){

		console.log('已连接', socket.address());

		socket.setEncoding('utf8');

		socket.on('data', function(data){

			console.log('数据：', data);

			console.log('数据长度：', socket.bytesRead);
		});

		socket.on('end', function(){
			console.log('客户端离开');
		});

		socket.write('你好');
	});

















