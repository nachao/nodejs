

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

	this.funs = require('../../funs');


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

	// 登陆后记录并导出数据
	// socket.on('entry', function(userkey){
	// 	console.log(' ----------- entry', userkey);
	// 	that.getLog(userkey, function(data){
	// 		console.log(' --- entry data', data);
	// 		if ( data ) {
	// 			if ( data.status == '0' ) {
	// 				that.updateStart(userkey, function(success, time){
	// 					if ( success ) {
	// 						data.start = time;
	// 						data.status = 1;
	// 						console.log(' --- socket.entry', data);
	// 					}
	// 				});
	// 			}
	// 		} else {
	// 			that.addLog(userkey, function(data){
	// 				console.log(' --- addLog', data);
	// 			});
	// 		}
	// 	});
	// });


	// 关闭浏览器后记录并计算
	socket.close(function(userkey) {
		if ( !userkey ) {
			return;
		}
		console.log(' ----------- close', userkey);
		that.getLog(userkey, function(data){
			console.log(' --- close data', data);
			that.updateValue(userkey, data, function(data){
				that.updateEnd(userkey, function(success, time){
					if ( success ) {
						data.start = time;
						data.status = 0;
						console.log(' --- socket.close', data);
					}
				});
			});
		});	
	});

	// 注销后记录并计算
	// socket.on('logout', function(userkey){
	// 	console.log(' ----------- logout', userkey);
	// 	that.getLog(userkey, function(data){
	// 		console.log(' --- logout data', data);
	// 		that.updateValue(userkey, data, function(data){
	// 			that.updateEnd(userkey, function(success, time){
	// 				if ( success ) {
	// 					data.start = time;
	// 					data.status = 0;
	// 					console.log(' --- socket.logout', data);
	// 				}
	// 			});
	// 		});
	// 	});		
	// });

	// 进入功能，返回数据
	// socket.on('get into', function(userkey){
	// 	console.log(' ----------- get into', userkey);
	// 	that.getLog(userkey, function(data){
	// 		that.updateValue(userkey, data, function(data){
	// 			socket.send('data', that.lib.comm.successData(data));
	// 			console.log(' --- data', data);
	// 		});
	// 	});
	// });

	// 领取
	// socket.on('get integral', function(userkey){
	// 	that.getLog(userkey, function(data){

	// 	});
	// });


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


// 上线执行操作
Ux002.prototype.setOnline = function ( userkey ) {
	var that = this;

	console.log(' ----------- entry', userkey);
	that.getLog(userkey, function(data){
		console.log(' --- entry data', data);
		if ( data ) {
			if ( data.status == '0' ) {
				that.updateStart(userkey, function(success, time){
					if ( success ) {
						data.start = time;
						data.status = 1;
						console.log(' --- socket.entry', data);
					}
				});
			}
		} else {
			that.addLog(userkey, function(data){
				console.log(' --- addLog', data);
			});
		}
	});
}


// 下线执行操作
Ux002.prototype.setOffline = function ( userkey ) {
	var that = this;

	console.log(' ----------- logout', userkey);
	that.getLog(userkey, function(data){
		console.log(' --- logout data', data);
		that.updateValue(userkey, data, function(data){
			that.updateEnd(userkey, function(success, time){
				if ( success ) {
					data.start = time;
					data.status = 0;
					console.log(' --- socket.logout', data);
				}
			});
		});
	});
}


// 下线执行操作
Ux002.prototype.setOffline = function ( userkey ) {
	var that = this;

	console.log(' ----------- logout', userkey);
	that.getLog(userkey, function(data){
		console.log(' --- logout data', data);
		that.updateValue(userkey, data, function(data){
			that.updateEnd(userkey, function(success, time){
				if ( success ) {
					data.start = time;
					data.status = 0;
					console.log(' --- socket.logout', data);
				}
			});
		});
	});
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
Ux002.prototype.getLog = function ( userkey, callback ){
	var sql = "SELECT `time_start`, `time_total`, `time_current`, `current_status` FROM ux73.ux002 where `time_begin` > "+ this.getTodayStart() +" and `userkey` = '"+ userkey +"';";

	this.lib.mysql.connection.query(sql, function(err, row){
		if ( !err && callback ) {
			var data = row[0];

			if ( data ) {
				data = {
					start: parseInt(data.time_start),
					total: parseInt(data.time_total),
					current: parseInt(data.time_current),
					status: data.current_status
				}
			}

			callback(data);
		}
	});
}


// 添加用户当前的记录
Ux002.prototype.addLog = function ( userkey, callback ){
	var time = parseInt(new Date().getTime() / 1000),
		resule = {
			start: time,
			total: 0,
			current: 0,
			status: 1
		},
		sql = "INSERT INTO `ux73`.`ux002` (`userkey`, `time_start`, `time_begin`) " + "VALUES ('"+ userkey +"', '"+ time +"', '"+ time +"');";

	if ( userkey ) {
		this.lib.mysql.connection.query(sql, function(err){
			if ( !err && callback )
				callback(resule);
		});
	}
}


// 刷新用户当前的离开时间和总时间
Ux002.prototype.updateIncome = function ( userkey, data, callback ){
	var time = parseInt(new Date().getTime() / 1000),
		that = this;

	// that.getLog(userkey, function(data){
		if ( data ) {
			var total = time - data.start + data.total,
				current = time - data.start + data.current,
				sql = "UPDATE `ux73`.`ux002` SET `time_total`='"+ total +"', `time_current`='"+ current +"' WHERE `time_begin` > "+ that.getTodayStart() +" and `userkey`='"+ userkey +"';";

			that.lib.mysql.connection.query(sql, function(err){
				if ( !err && callback )
					callback({
						start: time,
						total: total,
						current: current
					});
			});
		} else {
			if ( callback )
				callback(data);
		}
	// });
}


// 刷新上线时间
Ux002.prototype.updateStart = function ( userkey, callback ){
	var time = parseInt(new Date().getTime() / 1000),
		sql = "UPDATE `ux73`.`ux002` SET `time_start`='"+ time +"', `current_status` = '1' WHERE `time_begin` > "+ this.getTodayStart() +" and `userkey`='"+ userkey +"';";

	if ( userkey ) {
		this.lib.mysql.connection.query(sql, function(err, info){
			if ( !err && callback )
				callback(info.affectedRows, time);
		});
	}

	return time;
}


// 刷新离开时间
Ux002.prototype.updateEnd = function ( userkey, callback ){
	var time = parseInt(new Date().getTime() / 1000),
		sql = "UPDATE `ux73`.`ux002` SET `time_end`='"+ time +"', `current_status` = '0' WHERE `time_begin` > "+ this.getTodayStart() +" and `userkey`='"+ userkey +"';";

	if ( userkey ) {
		this.lib.mysql.connection.query(sql, function(err, info){
			if ( !err && callback )
				callback(info.affectedRows, time);
		});
	}

	return time;
}


// 刷新用户当前的离开时间和总时间
Ux002.prototype.updateValue = function ( userkey, data, callback ){
	var time = parseInt(new Date().getTime() / 1000),
		that = this;

	if ( data && data.status ) {
		var total = time - data.start + data.total,
			current = time - data.start + data.current,
			sql = "UPDATE `ux73`.`ux002` SET `time_end`='"+ time +"', `time_total`='"+ total +"', `time_current`='"+ current +"', `time_start`='"+ time +"' WHERE `time_begin` > "+ that.getTodayStart() +" and `userkey`='"+ userkey +"';";

		that.lib.mysql.connection.query(sql, function(err){
			if ( !err && callback )
				callback({
					start: time,
					total: total,
					current: current
				});
		});
	}
}


// 进入界面时刷新或创建当日数据
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
	that.updateValue(userkey, function(data){
		if ( data ) {
			callback(that.lib.comm.successData(data));
		} else {
			// 如果是当日首次登录则创建记录并返回记录信息
			// data = that.addLog(userkey);
			callback(that.lib.comm.successData(data));
		}
	});
}





module.exports = new Ux002();

