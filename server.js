 
 	var mysql = require('mysql');

 	var connection = mysql.createConnection({
 			host: 'localhost',
 			port: 3306,
 			database: 'ux73',
 			user: 'root',
 			password: 'nachao'
	 	});

 	connection.connect(function(err){
 		if ( err )
 			console.log('mysql链接失败');
 		else
 			console.log('mysql链接成功');
 	});

 	connection.query('SELECT * FROM ux73.user;', function(err, row){
 		console.log(row);
 	});