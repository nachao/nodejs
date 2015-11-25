
	// process.stdout.write('子进程当前工作目录为：' + process.cwd());

	// console.log('子进程 1 参数：', process.argv);

	// process.argv.forEach(function( val, index, array ){
	// 	process.stdout.write('\r\n' + index + ':' + val);
	// });

	// console.log('子进程1');






	// var http = require('http');

	// process.on('message', function(msg, server){

	// 	if ( msg == 'server' ) {
	// 		console.log('子进程中的服务已创建');
	// 	}

	// 	var tempServer = http.createServer();

	// 	tempServer.on('request', function(req, res){
	// 		console.log('1', req.url);

	// 		for ( var i =0, sum =0; i< 1000000; i++ ) {
	// 			sum += i;
	// 		}

	// 		res.write('客户端请求在子进程中被处理');
	// 		res.end('sum=' + sum);
	// 	});

	// 	tempServer.listen(server);

	// });




	// process.on('message', function(m, socket){

	// 	socket.end('客户端请求在子进程中被处理');

	// });



	// var http = require('http');

	// http.createServer(function(req, res){
	// 	res.writeHead(200, {
	// 		'Content-Type': 'text/html'
	// 	});
	// 	res.write('<head><meta charset="utf-8" /></head>');
	// 	res.end('你好\n');

	// 	console.log('这段代码运行在子进程中');

	// }).listen(1337);








































































	