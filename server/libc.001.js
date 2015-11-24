
// 未命名
function GuessBlindly () {


	this.record = {};

	this.param = {};

	this.param.answer = 0;

	this.param.endTime = 0;

	this.param.startTime = 0;

	this.param.totalTime = 1 * 30 * 1000;	// 60s

	this.param.restTime = 1 * 10 * 1000;	// 10s


	// 所有选项信息
	this.guess = {};



	// 所有进入此功能中的用户数据
	this.users = {};



	this.lib = {};

	this.lib.sio = require('socket.io');

	this.lib.comm = require('./core');	// --

	this.lib.mysql = require('./libc.mysql');	// --

	this.lib.mysql.init();



	this.init();

	this.res = null;



	this.setStart();

	// var that = this;

	// this.begin = function () {
	// }
}


// 初始化
GuessBlindly.prototype.init = function () {
	for ( var i = 1; i <= 9; i++ ) {
		this.record[i] = {
			number: 0,
			key: i,
			user: {}
		};
	}
}


// 重置
GuessBlindly.prototype.setReset = function () {
	for ( var key in this.record ) {
		this.record[key].number = 0;
		this.record[key].user = {};
	}

	return this.record;
}


// 选择
GuessBlindly.prototype.opt = function ( userkey, key ) {
	this.record[key].number += 1;

	if ( this.record[key].user[userkey] ) {
		this.record[key].user[userkey].a += 1;
	} else {
		this.record[key].user[userkey] = {
			a: 1,
			b: 0
		};
	}

	return this.record[key];
}


// 获取所有选项的数量
GuessBlindly.prototype.get = function () {
	var result = [];

	for ( var key in this.record ) {
		result.push(this.record[key].number);
	}

	return result;
}


// 开始计时
GuessBlindly.prototype.setStart = function () {
	var that = this;

	that.param.startTime = new Date().getTime();
	that.param.endTime = that.param.startTime + that.param.totalTime;
	that.param.answer = parseInt(Math.random() * 9) || 9;

	// 公布
	that.param.timeout = setTimeout(function(){
		that.setRight();
	}, that.param.totalTime);

	// 下一轮开始
	clearInterval(that.param.inverval);
	that.param.inverval = setInterval(function(){
		that.setStart();

		// 初始化
		that.init();
		that.res.emit('initialise', that.getAll(true));
		that.res.broadcast.emit('initialise', that.getAll(true));
	}, that.param.totalTime + that.param.restTime);
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


// 获取
GuessBlindly.prototype.socket = function ( server ) {

	var socket = this.lib.sio.listen(server);

	var that = this;

	var result = null;

	socket.on('connection', function(res){

		that.res = res;

		// that.begin();

		// 进入时保存用户数据
		res.on('Identity', function(userinfo){
			that.users[userinfo.key] = userinfo;
		});

		// 返回给单个用户倒计时数据
		res.on('get count down', function(){
			that.res.emit('set count down', that.getAll());
		});

		// 返回给单个用户界面数据
		res.on('get interface data', function(){
			that.res.emit('set interface data', that.getAll(true));
		});

		// 进行选择
		res.on('opt guess blindly', function(data){
			var user = that.users[data.userkey],
				item = null;

			if ( user && user.sum > 0 ) {
				item = that.opt(data.userkey, data.key);

				user.sum -= 1;	// 修改服务器缓存数据
				that.lib.mysql.setSum(user.key, user.sum, function(){	// 修改数据库用户积分
					res.emit('send userinfo sum', user.sum);
				});
				res.emit('send guess blindly item', item);
				res.broadcast.emit('send guess blindly item', item);
			}
		});

		// 获取个人得
		res.on('get my income', function(userkey){
			that.users[userkey] = userinfo;
		});

		// 离开提示
		res.on('disconnect', function(){
			console.log('close 001...!');
		});

		// 链接提示
		console.log('open 001...!');
		res.send('welcome to 001.');
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

