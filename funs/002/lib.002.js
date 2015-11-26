
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
	var that = this;

	that.lib.socket = socket;

	// 登陆后获取数据
	socket.open(function(userkey){
		if ( userkey ) {
			that.getDayData(userkey, function(data){
				socket.send('entry data', data);
			});
		}
	});

	// 关闭浏览器后记录并计算
	socket.close(function(userkey){
		if ( userkey ) {
			that.updateLeave(userkey, function(data){
				console.log(' ----------- socket.close', data);
			});
		}
	});

	// 注销后记录并计算
	socket.get('logout', function(userkey){
		if ( userkey ) {
			that.updateLeave(userkey, function(data){
				console.log(' ----------- logout', data);
			});
		}
	});

	// 登陆后记录并导出数据
	socket.get('entry', function(userkey){
		if ( userkey ) {
			that.updateLeave(userkey, function(data){
				console.log('entry', data);
			});
		}
	});


	// socket.send('data', '客服端你好！');

	// socket.get('data', function(data){
	// 	console.log(data);
	// });


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

	sql = "SELECT `time_start`, `time_end`, `time_total` FROM ux73.ux002 where `time_begin` > "+ parseInt(time.getTime() / 1000) +" and `userkey` = '"+ userkey +"';";

	this.lib.mysql.connection.query(sql, function(err, row){
		if ( !err && callback ) {
			var data = row[0];

			if ( data ) {
				data = {
					start: parseInt(data.time_start),
					total: parseInt(data.time_total)
				}
			}

			callback(data);
		}
	});
}


// 添加用户当前的记录
Ux002.prototype.addDayLog = function ( userkey, callback ){
	var time = parseInt(new Date().getTime() / 1000),
		sql = "INSERT INTO `ux73`.`ux002` (`userkey`, `time_start`, `time_end`, `time_total`, `time_begin`) " + 
			"VALUES ('"+ userkey +"', '"+ time +"', '0', '0', '"+ time +"');";

	this.lib.mysql.connection.query(sql, function(err){
		if ( !err && callback ) {
			callback({
				start: time,
				total: 0
			});
		}
	});
}


// 刷新用户当前的再次登录时间
Ux002.prototype.updateEntry = function ( userkey, callback ){
	var time = parseInt(new Date().getTime() / 1000),
		sql = "UPDATE `ux73`.`ux002` SET `time_end`='0', `time_start`='"+ time +"' WHERE `userkey`='"+ userkey +"';";

	this.lib.mysql.connection.query(sql, function(err){
		if ( !err && callback ) {
			callback(userkey);
		}
	});
}


// 刷新用户当前的离开时间和总时间
Ux002.prototype.updateLeave = function ( userkey, callback ){
	var time = parseInt(new Date().getTime() / 1000),
		that = this;

	that.getDayLog(userkey, function(data){
		if ( data ) {
			var sql = "UPDATE `ux73`.`ux002` SET `time_end`='"+ time +"', `time_total`='"+ (time - data.start + data.total) +"', `time_start`='0' WHERE `userkey`='"+ userkey +"';";

			that.lib.mysql.connection.query(sql, function(err){
				if ( !err && callback ) {
					callback(userkey);
				}
			});
		}
	});
}


// 首次登陆后获取数据
Ux002.prototype.getDayData = function ( userkey, callback ){
	var that = this;

	that.getDayLog(userkey, function(data){
		if ( !data ) {
			data = that.addDayLog(userkey);	// 如果是当日首次登录则创建记录并返回记录信息
		} else if ( data.start == '0' ) {
			that.updateEntry(userkey);			// 如果是当日再次登录则刷新记录
		}
		callback(that.lib.comm.getSuccessData(data));
	});
}






module.exports = new Ux002();

