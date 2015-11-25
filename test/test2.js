
	// var fs = require('fs');

	// var out = fs.createWriteStream('./t.html');

	// process.stdin.on('data1', function(data){
	// 	out.write(data);
	// });

	// process.stdin.on('end', function(data){
	// 	process.exit();
	// });

	var value = process.argv[2];

	process.stdout.write(value);

	// process.argv.forEach(function( val, index, array ){
	// 	process.stdout.write('\r\n' + index + ':' + val);
	// });