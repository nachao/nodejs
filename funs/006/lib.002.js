/*====

// 数据库说明

'time_start' = 最近一次开始计算时间
'time_end' = 最近一次离线时间
'time_total' = 当日已经提现并兑换成积分的总时间（秒）
'time_begin' = 当日开始时间
'time_current' = 当日挂机中未提现出的总时间（秒）
'current_status' = 1=在线，0=离线

// 方法说明
	_updateCurrent()
	应用场景：
		每次登录成功时、每次进入挂机界面时、每次点击领取时



====*/


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

	// 关闭浏览器后记录并计算
	socket.close(function(userkey) {
		if ( userkey ) {
			that._updateCurrentEnd({
				uid: userkey
			});
		}
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


/*
*  添加用户当前的记录
*
*  @ param {string} uid = 用户唯一id
*  @ param {function} callback = 回调
*
*  @ private
*/
Ux002.prototype._addLog = function ( uid, callback ){
	var time = parseInt(new Date().getTime() / 1000),
		resule = {
			start: time,
			total: 0,
			current: 0,
			status: 1,
			time: time,
			begin: time
		},
		sql = "INSERT INTO `ux73`.`ux002` (`userkey`, `time_start`, `time_begin`, `current_status`) " + "VALUES ('"+ uid +"', '"+ time +"', '"+ time +"', '1');";

	if ( uid ) {
		this.lib.mysql.connection.query(sql, function(err){
			if ( !err && callback )
				callback(resule);
		});
	}
}


/*
*  搜索用户当日的记录
*
*  @ param {object} param = 参数
*  @ param {function} callback = 回调
*
*  @ private
*/
Ux002.prototype._getLog = function ( uid, callback ){
	var time = parseInt(new Date().getTime() / 1000),
		begin = this.getTodayStart(),
		that = this,
		sql = "SELECT `time_start`, `time_total`, `time_current`, `current_status` FROM ux73.ux002 where `time_begin` > "+ begin +" and `userkey` = '"+ uid +"';";

	this.lib.mysql.connection.query(sql, function(err, row, info){
		if ( !err && callback ) {
			var data = row[0],
				result = {};

			// 如果有则返回
			if ( data ) {
				result.once = 60;
				result.time = time;
				result.begin = begin;

				result.start = parseInt(data.time_start);
				result.total = parseInt(data.time_total);
				result.current = parseInt(data.time_current);
				result.status = data.current_status;
				result.insert = parseInt(time - data.time_start);

				result.number = parseInt(result.current / result.once);
				result.numberTime = data.number * result.once;
				result.numberTotal = parseInt((result.total + result.current) / result.once);

				callback(result);

			// 没有搜索到用户数据则创建
			} else {
				that._addLog(uid, function(data){
					result.once = 60;
					result.insert = 0;
					result.number = 0;
					result.numberTime = 0;

					callback(result);
				});
			}

		}
	});
}


/*
*  根据后台数据进行解析
*
*  @ param {object} data = 参数
*
*  @ private
*/
Ux002.prototype._getLogParse = function ( value ){
	var result = {};

	value = value || {};

	result.once = 60;

	result.start = parseInt(value.time_start);
	result.current = parseInt(value.time_current);
	result.total = parseInt(value.time_total);
	result.status = value.current_status;

	result.time = parseInt(new Date().getTime() / 1000);
	result.begin = this.getTodayStart();

	result.insert = parseInt(result.time - result.start);
	result.number = parseInt(result.current / result.once);
	result.numberTime = result.number * result.once;

	return data;
}


/*
*  开始计时，刷新用户本日挂机的总时间，和更新开始时间
*
*  @ param {object} param = 参数
*  @ param {function} callback = 回调
*
*  @ private
*/
Ux002.prototype._updateCurrent = function ( param ,callback ){
	var that = this,
		sql = '';

	that._getLog(param.uid, function(data){
		data.current += data.insert;
		data.number = parseInt(data.current / data.once);
		data.numberTime = data.number * data.once;

		sql = "UPDATE `ux73`.`ux002` SET `time_current`='"+ data.current +"', `time_start`='"+ data.time +"', `current_status`='1' WHERE `time_begin` > "+ data.begin +" and `userkey`='"+ param.uid +"';";

		if ( param.uid ) {
			that.lib.mysql.connection.query(sql, function(err, info){
				if ( !err && callback ) {
					callback(that.lib.comm.successData(data));
				}
			});
		}
	});
}


/*
*  刷新本日领取总时间，和刷新挂机剩余总时间
*
*  @ param {object} param = 参数
*  @ param {function} callback = 回调
*
*  @ private
*/
Ux002.prototype._updateTotal = function ( param, callback ){
	var that = this,
		sql = '';

	that._updateCurrent(param, function(res){
		var data = res.data;
		if ( data && param.uid ) {
			sql = "UPDATE `ux73`.`ux002` SET `time_total`='"+ (data.total + data.numberTime) +"', `time_current`='"+ (data.current - data.numberTime) +"' WHERE `time_begin` > "+ data.begin +" and `userkey`='"+ param.uid +"';";

			console.log(data);
			console.log(sql);

			that.lib.mysql.connection.query(sql, function(err, info){
				if ( !err && callback ) {
					that.lib.user.setSumAdd(param.uid, data.number, function(res){
						callback(that.lib.comm.successData(res.data, '领取挂机积分成功'));
					});
				}
			});
		} else {
			callback(that.lib.comm.errerData('刷新本日领取总时间，失败！'));
		}
	});
}


/*
*  结束计时，刷新用户本日挂机的总时间，和更新开始时间
*
*  @ param {object} param = 参数
*  @ param {function} callback = 回调
*
*  @ private
*/
Ux002.prototype._updateCurrentEnd = function ( param ,callback ){
	var that = this,
		sql = '';

	that._updateCurrent(param, function(data){
		data.current += data.insert;
		sql = "UPDATE `ux73`.`ux002` SET `time_end`='"+ data.time +"', `current_status`='0' WHERE `time_begin` > "+ data.begin +" and `userkey`='"+ param.uid +"';";

		if ( param.uid ) {
			that.lib.mysql.connection.query(sql, function(err, info){
				if ( !err && callback )
					callback(that.lib.comm.successData(data, '更新挂机时间'));
			});
		} else {
			callback(that.lib.comm.errerData('结束挂机，失败！'));
		}
	});
}






// -------------------------------------------


/*
*  开始挂机
*
*  @ param {object} param = 参数
*  @ param {function} callback = 回调
*
*  @ publice
*/
Ux002.prototype.start = function ( param ,callback ){
	this._updateCurrent(param ,callback);
}


/*
*  更新挂机
*
*  @ param {object} param = 参数
*  @ param {function} callback = 回调
*
*  @ publice
*/
Ux002.prototype.update = function ( param ,callback ){
	this._updateCurrent(param ,callback);
}


/*
*  结束挂机
*
*  @ param {object} param = 参数
*  @ param {function} callback = 回调
*
*  @ publice
*/
Ux002.prototype.end = function ( param ,callback ){
	this._updateCurrentEnd(param ,callback);
}


/*
*  领取累积时间的整数
*
*  @ param {object} param = 参数
*  @ param {function} callback = 回调
*
*  @ publice
*/
Ux002.prototype.receive = function ( param ,callback ){
	this._updateTotal(param ,callback);
}



module.exports = new Ux002();

