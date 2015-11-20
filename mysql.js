
// ====
// 用户中心
// ====

// 初始化模板
var mysql      = require('mysql');

// 链接
var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'nachao',
		database : 'ux73'
	});

	connection.connect(function(err) {
		if (err) {
			console.error('数据库链接失败!: ' + err.stack);
		} else {
			console.log('数据库链接成功!');
		}
	});

// console.log(connection);

connection.query('SELECT * FROM ux73.user;', function(err, rows, fields) {
	if (err) throw err;
	console.log('The solution is: ', rows);
});

// connection.end();



// 判断用户名是否存在
function createUser ( name ) {
	var sql = "INSERT INTO `ux73`.`user` (`name`) VALUES ('"+ name +"');";
	console.log(sql);
}

// 判断用户名是否存在
function beUser ( name ) {
	var sql = "INSERT INTO `ux73`.`user` (`name`) VALUES ('"+ name +"')	;";
	console.log(sql);
}







var exec = require('child_process').exec;

function a( response ){
	console.log('is a!');

	var content = 'empty';

	exec('find/',
		{ timeout: 20000, maxBuffer: 20000 * 1024 },
		function( error, stdout, stderr ){
		// content = stdout;

		response.writeHead( 200, { 'Content-Type': 'text/plain' });
		response.write(content);
		response.end();
	});

	// return content;

	// function sleep ( milliSeconds ) {
	// 	var startTime = new Date().getTime();
	// 	while ( new Date().getTime() < startTime + milliSeconds );
	// }

	// sleep(5000);
	// return 'is a!';
}

function b( response ){
	console.log('is b!');

	response.writeHead( 200, { 'Content-Type': 'text/plain' });
	response.write('is Bad!');
	response.end();
	// return 'is b!';
}

function c( response ){
	console.log('is c!');

	response.writeHead( 200, { 'Content-Type': 'text/plain' });
	response.write('is Cool!');
	response.end();
	// return 'is c!';
}

exports.a = a;
exports.b = b;
exports.c = c;