
// 未命名
function GuessBlindly () {

	// 所有选项信息
	this.record = {};

	// 所有参数
	this.param = {};

	// 所有进入此功能中的用户数据，每轮结束后清空
	this.users = {};

	// 所有模板
	this.lib = {};




	// 初始化数据
	this.initData();

	// 初始化模板
	this.initLib();



	// 初始化模板 - 数据库
	this.lib.mysql.init();
}


// 初始化数据
GuessBlindly.prototype.initData = function () {

	this.param.answer = 0;

	this.param.endTime = 0;

	this.param.startTime = 0;

	this.param.totalTime = 30 * 60 * 1000;	// 30min

	this.param.restTime = 1 * 60 * 1000;	// 1min

	for ( var i = 1; i <= 9; i++ ) {
		this.record[i] = {
			number: 0,
			key: i,
			user: {}
		};
	}
}


// 初始化引用使用到的模板
GuessBlindly.prototype.initLib = function () {

	this.lib.sio = require('socket.io');

	this.lib.comm = require('./core');	// --

	this.lib.mysql = require('./libc.mysql');	// --

}


// 获取用户的信息
GuessBlindly.prototype.getInfo = function ( userkey ) {
	var userinfo = this.getActor(userkey);

	if ( !userinfo ) {
		userinfo = this.addActor(userkey);
	}

	return return userinfo;
}


// 判断用户是否有参与过本轮
GuessBlindly.prototype.isJoin = function ( userkey ) {
	return !!this.users[userkey];
}


// 获取指定的参与者
GuessBlindly.prototype.getActor = function ( userkey ) {
	return this.users[userkey];
}


// 保存指定的参与者
GuessBlindly.prototype.addActor = function ( userkey ) {
	this.users[userkey] = {
		number: 0,
		totalTime: 0,

		startTime: 0,
		endTime: 0
	};

	return this.users[userkey];
}


// 设置指定的参与者参数
GuessBlindly.prototype.setActor = function ( userkey, param ) {
	var user = this.users[userkey];
	if ( user ) {
		for ( var k in param ) {
			user[k] = param[k];
		}
	}
	return user;
}


// 获取状态信息
GuessBlindly.prototype.getAll = function ( data ) {
	return {
		record: data ? this.record : null,
		status: this.param.endTime > new Date().getTime(),
		startTime: this.param.startTime,
		endTime: this.param.endTime,
		totalTime: this.param.totalTime
	}
}


// 获取倒计时信息
GuessBlindly.prototype.getCountdown = function ( data ) {
	return {
		status: this.param.endTime > new Date().getTime(),
		startTime: this.param.startTime,
		endTime: this.param.endTime,
		totalTime: this.param.totalTime
	}
}


// 设置此功能为长链接
GuessBlindly.prototype.openServer = function ( server ) {

	var socket = this.lib.sio.listen(server);

	var that = this;


	// 此功能的所有事件在此定义
	socket.on('connection', function(res){

		// 进入时保存用户数据
		// res.on('Identity', function(userinfo){
		// 	that.users[userinfo.key] = userinfo;
		// });

		// 返回给单个用户倒计时数据
		res.on('get count down', function(){
			res.emit('set count down', that.getCountdown());
		});

		// 返回给单个用户界面数据
		res.on('get interface data', function(){
			res.emit('set interface data', that.getAll(true));
		});

		// 进行选择
		res.on('set an option', function(data){
			var user = that.getActor(data.user.key),
				item = null;

			// 如果已经参加过，则获取保存的用户信息
			// 如果此用户尚未参加过，则保存用户信息
			if ( !user ) {
				user = that.addActor(data.user);
			}

			// 如果用户满足条件，则设置选项和用户参数
			if ( user && user.sum > 0 ) {

				item = that.setOpt(user.key, data.key);
				user = that.setActor(user.key, {
					sum: user.sum - 1
				});

				// 刷新用户积分
				that.lib.mysql.setSum(user.key, user.sum, function(){
					res.emit('send userinfo sum', user.sum);
				});

				// 发布选项信息
				res.emit('send guess blindly item', item);
				res.broadcast.emit('send guess blindly item', item);
			}
		});

		// 获取个人得
		// res.on('get my income', function(userkey){
		// 	that.users[userkey] = userinfo;
		// });

		// 离开提示
		res.on('disconnect', function(){
			console.log('close 001...!');
		});

		// 链接提示
		console.log('open 001!');
		// res.send('welcome to 001.');
	});
}


// 处理所有正确用户
GuessBlindly.prototype.setRight = function () {

	var key = null,
		total = 0,
		winner = this.record[this.param.answer],
		that = this,
		user = null;

	for ( key in this.record ) {
		total += this.record[key].number;
	}

	for ( key in winner.user ) {
		winner.user[key].b = parseInt(winner.user[key].a / winner.number * total);

		user = that.users[key];
		that.lib.mysql.setSum(key, user.sum + winner.user[key].b);
	}

	// 公布
	this.res.emit('reveal answer', that.param.answer, winner.user);
	this.res.broadcast.emit('send ux001', winner.user, winner.user);
}







module.exports = new GuessBlindly();

