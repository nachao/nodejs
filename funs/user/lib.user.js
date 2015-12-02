
// 数据库管理
function User () {



	/*
	*  引用自定义公共模板
	*  private
	*/
	this.lib = {};

	this.lib.comm = require('../comm/lib.comm');

	this.lib.mysql = require('../mysql/lib.mysql');



	// 开启数据库
	this.lib.mysql.init();

	// 将全部用户设置为离线
	this.setAllOnline();


	console.log('new lib.user...');
}


// 创建用户
User.prototype.query = function ( sql, callback ) {
	this.lib.mysql.connection.query(sql, callback);
}



// 判断用户是否登录
User.prototype.getStatus = function ( userkey, callback ) {
	var sql = "SELECT `status` FROM ux73.user where `uid` = '"+ userkey +"';";

	if ( userkey ) {
		this.query(sql, function(err, row){
			var data = false;

			if ( row[0] )
				data = row[0].status == '1';

			if ( !err && callback )
				callback(data == '1');
		});
	}
}


// 设置全部用户为离线状态
User.prototype.setAllOnline = function () {
	var sql = "update ux73.user set `status` = 0 where `status` = 1;";

	this.query(sql, function(err, info){
		if ( !err )
			console.log('下线数量：' + info.affectedRows)
	});
}


// 设置用户状态
User.prototype.setStatus = function ( userkey, status, callback ) {
	var sql = "UPDATE `ux73`.`user` SET `status`='"+ status +"' WHERE `uid`='"+ userkey +"';";

	this.query(sql, function(err, row){
		if (err)
			console.log(err);
		else
			if ( callback )
				callback();
	});
}


// 设置用户状态为离线
User.prototype.setOffline = function ( uid, callback ) {
	var sql = "UPDATE `ux73`.`user` SET `status`='0', `key`='' WHERE `uid`='"+ uid +"';";

	this.query(sql, function(err, row){
		if ( !err && callback )
				callback();
	});
}


// 根据前端缓存的 uid 和 key 获取用户信息
User.prototype.selectByUidAndKey = function ( uid, key, callback ) {
	var sql = "SELECT `uid`, `name`, `sum`, `status` FROM ux73.user where `uid` = '"+ uid +"' and `key` = '"+ key +"';";

	this.query(sql, function(err, rows) {
		if ( !err && callback )
			callback(rows[0]);
	});
}


// 根据 uid 获取用户信息
User.prototype.userSelectByUid = function ( uid, callback ) {
	var sql = "SELECT `uid`, `name`, `sum`, `status` FROM ux73.user where `uid` = '"+ uid +"';";

	this.query(sql, function(err, rows) {
		if (err)
			console.log(err);
		else
			if ( callback )
				callback(rows[0]);
	});
}


// 根据 name 获取用户信息
User.prototype.userSelectByName = function ( name, callback ) {
	var sql = "SELECT `uid`, `name`, `sum`, `status` FROM ux73.user where `name` = '"+ name +"';";

	this.query(sql, function(err, rows) {
		if (err)
			console.log(err);
		else
			if ( callback )
				callback(rows[0]);
	});
}


// 创建用户
User.prototype.userCreate = function ( account, callback ) {
	var time = new Date().getTime(),
		user = {
			uid: this.lib.comm.md5(String(time)),
			name: account,
			sum: 0,
			key: this.lib.comm.md5(String(new Date().getTime()))
		},
		sql = "INSERT INTO `ux73`.`user` (`uid`, `name`, `sum`, `create_time`, `key`) VALUES ('"+ user.uid +"', '"+ user.name +"', '"+ user.sum +"', '"+ time +"', '"+ user.key +"');"

	this.query(sql, function(err) {
		if ( !err && callback )
			callback(user);
	});
}


// 删除钥匙
User.prototype.deleteKey = function ( uid, callback ) {
	var sql = "UPDATE `ux73`.`user` SET `key`=null WHERE `uid`='"+ uid +"';";

	this.query(sql, function(err) {
		if ( !err && callback )
			callback(user);
	});
}


// 为登录用户创建钥匙
User.prototype.createKey = function ( param, callback ) {
	var that = this,
		key = this.lib.comm.md5(String(new Date().getTime())),
		sql = "UPDATE `ux73`.`user` SET `key`='"+ key +"' WHERE `uid`='"+ param.uid +"';";

	this.query(sql, function(err) {
		if ( !err && callback )
			callback(that.lib.comm.successData(key));
	});
}


// 刷新用户积分
User.prototype.setSum = function ( uid, num, callback ) {
	var sql = "UPDATE `ux73`.`user` SET `sum`='"+ num +"' WHERE `uid`='"+ uid +"';";

	if ( uid ) {
		this.query(sql, function(err) {
			if (err)
				console.log(err);
			else
				if ( callback )
					callback(num);
		});
	}
}


// 刷新用户积分 - 添加积分
User.prototype.setSumAdd = function ( uid, num, callback ) {
	var that = this;

	that.userSelectByUid(uid, function(userinfo){
		that.setSum(uid, userinfo.sum + num, function(sum){
			callback(that.lib.comm.successData({
				add: num,
				before: userinfo.sum,
				current: userinfo.sum + num
			}));
		});
	});
}


// 设置用户状态为在线
User.prototype.setOnline = function ( userkey, callback ) {
	this.setStatus(userkey, '1', callback);
}


// 设置用户状态为离线
User.prototype.setOffline = function ( userkey, callback ) {
	this.setStatus(userkey, '0', callback);
}


// 使用钥匙和uid登录
User.prototype.keyEntry = function ( param, callback ) {
	var that = this;

	that.selectByUidAndKey(param.uid, param.key, function(data){	// 根据Key获取用户信息
		if ( data ) {
			callback(that.lib.comm.successData(data));

			// 登录成功后执行
			// that.lib.ux002.setOnline();
		} else {
			callback(that.lib.comm.errerData('key error.'));
		}
	});
}


// 确认钥匙
User.prototype.keyConfirm = function ( param, callback ) {
	var that = this;

	that.selectByUidAndKey(param.uid, param.key, function(data){	// 根据Key获取用户信息
		if ( data ) {
			that.setStatus(data.uid, '1');
			callback(that.lib.comm.successData('钥匙验证成功。'));
		} else {
			that.setOffline(param.uid);
			callback(that.lib.comm.errerData('钥匙验证失败。'));
		}
	});
}


// 使用name登录，或注册
User.prototype.accountEntry = function ( param, callback ) {
	var that = this;

	that.userSelectByName(param.account, function(data){	// 根据Name获取用户信息
		if ( data ) {
			// 判断是否为登录状态
			that.getStatus(data.uid, function(status){
				if ( status ) {
					callback(that.lib.comm.errerData('已被登录'));
				} else {
					that.setOnline(data.uid);
					// that.createKey(data.uid, function(key){	// 创建钥匙
					// 	data.key = key;
						callback(that.lib.comm.successData(data));
					// });
				}
			});
		} else {
			that.userCreate(param.account, function(data){	// 如果没获取到，则根据给定的账户名创建新账号
				if ( data ) {
					result = that.lib.comm.successData(data);
				} else {
					result = that.lib.comm.errerData();
				}
				callback(result);
			});
		}
	});
}


// 退出登录
User.prototype.setLogout = function ( param, callback ) {
	var that = this;

	that.setOffline(param.uid, function(data){
		that.deleteKey(param.uid);
		that.lib.comm.deleteUserData(param.uid);
		callback(that.lib.comm.successData(data));
	});
}



module.exports = new User();

