
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
		that.setInitData(userkey, function(data){
			// socket.send('data', data);
			console.log(' ----------- socket.open', data);
		});
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
	socket.on('logout', function(userkey){
		if ( userkey ) {
			that.updateLeave(userkey, function(data){
				console.log(' ----------- logout', data);
			});
		}
	});

	// 登陆后记录并导出数据
	socket.on('entry', function(userkey){
		if ( userkey ) {
			that.updateLeave(userkey, function(data){
				console.log(' ----------- entry', data);
			});
		}
	});

	// 返回前端请求的数据
	socket.on('get data', function(userkey){
		that.setInitData(userkey, function(data){
			socket.send('data', data);
			console.log(' ----------- get data', data);
		});
	});

	// 领取
	socket.on('taken sum', function(userkey){
		that.setInitData(userkey, function(data){
			socket.send('data', data);
			console.log(' ----------- get data', data);
		});
	});


	// socket.send('data', {a:'客服端你好！'});

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


// 获取今天0点的时间戳
Ux002.prototype.getTodayStart = function (){
	var time = new Date();

	time.setHours(0);
	time.setMinutes(0);
	time.setSeconds(0);

	return parseInt(time.getTime() / 1000);
}


// 搜索用户当日的记录
Ux002.prototype.getDayLog = function ( userkey, callback ){
	var sql = "SELECT `time_start`, `time_end`, `time_total` FROM ux73.ux002 where `time_begin` > "+ this.getTodayStart() +" and `userkey` = '"+ userkey +"';";

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
		sql = "INSERT INTO `ux73`.`ux002` (`userkey`, `time_start`, `time_end`, `time_total`, `time_begin`) " + "VALUES ('"+ userkey +"', '"+ time +"', '0', '0', '"+ time +"');";

	this.lib.mysql.connection.query(sql, function(err){
		// if ( !err && callback ) {
		// 	callback({
		// 		start: time,
		// 		total: 0
		// 	});
		// }
	});

	return {
		start: time,
		total: 0
	};
}


// 刷新用户当前的离开时间和总时间
Ux002.prototype.updateLeave = function ( userkey, callback ){
	var time = parseInt(new Date().getTime() / 1000),
		that = this;

	that.getDayLog(userkey, function(data){
		if ( data ) {
			var total = time - data.start + data.total,
				sql = "UPDATE `ux73`.`ux002` SET `time_end`='"+ time +"', `time_total`='"+ total +"', `time_start`='"+ time +"' WHERE `time_begin` > "+ that.getTodayStart() +" and `userkey`='"+ userkey +"';";

			that.lib.mysql.connection.query(sql, function(err){
				if ( !err && callback )
					callback({
						start: time,
						total: total
					});
			});
		} else {
			if ( callback )
				callback(data);
		}
	});
}


// 登陆或进入界面时刷新或创建当日数据
Ux002.prototype.setInitData = function ( userkey, callback ){
	var that = this;

	callback = callback || function () {};

	if ( !userkey ) {
		if ( callback ) {
			callback(that.lib.comm.errerData(data));
		}
		return;
	}

	// 如果是当日再次登录则刷新记录
	that.updateLeave(userkey, function(data){
		if ( data ) {
			callback(that.lib.comm.successData(data));
		} else {
			// 如果是当日首次登录则创建记录并返回记录信息
			data = that.addDayLog(userkey);
			callback(that.lib.comm.successData(data));
		}
	});
}





module.exports = new Ux002();

