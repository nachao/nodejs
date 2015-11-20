		

	// 初始化模板
	var mysql      = require('../node_modules/mysql');

	// 链接mysql数据库
	var connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'nachao',
			database : 'ux73'
		}).connect(function(err) {
			if (err) {
				console.error('数据库链接失败!: ' + err.stack);
			} else {
				console.log('数据库链接成功!');
			}
		});


	var http = require('http');

	var fs = require('fs');

	var url = require('url');

	// 创建服务
	/*
	var server = http.createServer(function(req, res){

		if ( req.url == '/favicon.ico' ) {
			return;
		// 	var out = fs.createWriteStream('./request.log');
		// 	out.write('客户端请求所使用的方法为：' + req.method + '\r\n');
		// 	out.write('客户端请求所用的url字符串为：' + req.url + '\r\n');
		// 	out.write('客户端请求头对象为：' + JSON.stringi	fy(req.headers) + '\r\n');
		// 	out.end('客户端请求所用HTTP版本为：' + req.httpVersion);
		}

		res.writeHead(200, {
			'Content-Type': 'text/plain',
			'Access-Control-Allow-Origin': 'http://127.0.0.1:8080/index.html'
		});

		console.log(req.headers);

		res.write('你好');

		res.end();

		// console.log( url.parse(req.url, true).query );

		// var sql = "INSERT INTO `ux73`.`user` (`name`) VALUES ('"+ name +"');";
		// connection.query(sql, function(err, rows, fields) {
		// 	if (err) throw err;
		// 	console.log(rows);
		// });

		// res.end();

	}).listen(8080, '127.0.0.1');
	*/


	fs.readFile('./index.html', function (err, html) {
		if (err) {
			throw err; 
		}       
	
		http.createServer(function(request, response) {  
			response.writeHeader(200, {"Content-Type": "text/html"});  
			response.write(html);  
			response.end();  
		}).listen(8000, '127.0.0.1');
	
		console.log('服务器创建成功');
	});

