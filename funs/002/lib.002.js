
// 挂机
function Ux002 () {


	/*
	*  引用自定义公共模板
	*  private
	*/
	this.lib = {};

	this.lib.comm = require('../comm/lib.comm');

	this.lib.user = require('../user/lib.user');

	this.lib.mysql = require('../mysql/lib.mysql');


	/*
	*  引用node模板
	*  private
	*/
	this.lib.socket = null;




	// 开启数据库
	this.lib.mysql.init();


	// 简化外部方法

	// 提示
	console.log('new lib.002...');
}


/*
*  初始化功能监听
*
*  private
*/
Ux002.prototype.init = function ( socket ) {

	this.lib.socket = socket;


	socket.open(function(userkey){
		console.log('---- connection ux002 ---- open', userkey);
	});

	socket.close(function(){
		console.log('---- disconnect ux002 ---- close');
	});

	// var socket = this.lib.sio.listen(server);

	// var that = this;

	// socket.on('connection', function(res){

	// 	// 离开提示
	// 	res.on('disconnect', function(data){
	// 		console.log('---- connection ux002 ---- close', res.handshake.headers.cookie);
	// 	});

	// 	// 链接提示
	// 	console.log('---- connection ux002 ---- open', res.handshake.headers.cookie);
	// 	// res.send('welcome to 001.');
	// });

	// console.log('Ux002.prototype.init...');
}



// 搜索用户当日的记录
Ux002.prototype.getDayLog = function ( userkey, callback ){
	var time = new Date(),
		sql = '';

	time.setHours(0);
	time.setMinutes(0);
	time.setSeconds(0);

	sql = "SELECT `time_start`, `time_end`, `time_total` FROM ux73.ux002 where `time_begin` > "+ time.getTime() +" and `userkey` = '"+ userkey +"';";

	this.lib.mysql.connection.query(sql, function(err, row){
		if ( !err && callback ) {
			callback(row[0]);
		}
	});
}


// 添加用户当前的记录
Ux002.prototype.addDayLog = function ( userkey, callback ){
	var time = new Date().getTime(),
		sql = "INSERT INTO `ux73`.`ux002` (`userkey`, `time_start`, `time_end`, `time_total`, `time_begin`) " + 
			"VALUES ('"+ userkey +"', '"+ time +"', '0', '0', '"+ time +"');";

	this.lib.mysql.connection.query(sql, function(err){
		if ( !err && callback ) {
			callback({
				time_start: time,
				time_end: 0,
				time_total: 0
			});
		}
	});
}


// 刷新用户当前的再次登录时间
Ux002.prototype.updateEntry = function ( userkey, callback ){
	var time = new Date().getTime(),
		sql = "UPDATE `ux73`.`ux002` SET `time_end`='"+ 0 +"', `time_start`='"+ time +"' WHERE `userkey`='"+ userkey +"';";

	this.lib.mysql.connection.query(sql, function(err){
		if ( !err && callback ) {
			callback(userkey);
		}
	});
}


// 刷新用户当前的离开时间和总时间
Ux002.prototype.updateLeave = function ( userkey, callback ){
	var time = new Date().getTime(),
		that = this;

	that.getDayLog(userkey, function(data){
		var sql = "UPDATE `ux73`.`ux002` SET `time_end`='"+ time +"', `time_total`='"+ (time - data.time_start + data.time_total) +"', `time_start`='"+ 0 +"' WHERE `userkey`='"+ userkey +"';";

		that.lib.mysql.connection.query(sql, function(err){
			if ( !err && callback ) {
				callback(userkey);
			}
		});
	});
}



// 刷新用户积分
// Mysql.prototype.setSum = function ( key, num, callback ) {
// 	var sql = "UPDATE `ux73`.`user` SET `sum`='"+ num +"' WHERE `key`='"+ key +"';";
// 	this.connection.query(sql, function(err) {
// 		if (err)
// 			console.log(err);
// 		else
// 			if ( callback )
// 				callback(key, num);
// 	});
// }






module.exports = new Ux002();

