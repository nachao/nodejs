
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
			sum: 10000,
			key: this.lib.comm.md5(String(new Date().getTime()))
		},
		sql = "INSERT INTO `ux73`.`user` (`uid`, `name`, `sum`, `create_time`, `key`) VALUES ('"+ user.uid +"', '"+ user.name +"', '"+ user.sum +"', '"+ time +"', '"+ key +"');"

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
User.prototype.createKey = function ( uid, callback ) {
	var key = this.lib.comm.md5(String(new Date().getTime())),
		sql = "UPDATE `ux73`.`user` SET `key`='"+ key +"' WHERE `uid`='"+ uid +"';";

	this.query(sql, function(err) {
		if ( !err && callback )
			callback(key);
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
User.prototype.keyEntry = function ( uid, key, callback ) {
	var that = this;

	that.selectByUidAndKey(uid, key, function(data){	// 根据Key获取用户信息
		if ( data ) {
			that.createKey(data.uid, function(key){		// 如果钥匙还可以使用，则登陆用户，并创建新钥匙
				data.key = key;
				that.setOnline(data.uid);				// 设置用户为在线状态
				callback(that.lib.comm.successData(data));
			});
		} else {
			callback(that.lib.comm.errerData('key 失效。'));
		}
	});
}


// 使用name登录，或注册
User.prototype.nameEntry = function ( name, callback ) {
	var that = this;

	that.userSelectByName(name, function(data){	// 根据Name获取用户信息
		if ( data ) {
			// 判断是否为登录状态
			that.getStatus(data.uid, function(status){
				if ( status ) {
					callback(that.lib.comm.errerData('已被登录'));
				} else {
					that.setOnline(data.uid);
					that.createKey(data.uid, function(key){	// 创建钥匙
						data.key = key;
						callback(that.lib.comm.successData(data));
					});
				}
			});
		} else {
			that.userCreate(name, function(data){	// 如果没获取到，则根据给定的账户名创建新账号
				if ( data ) {
					that.lib.comm.executeEntrySuccess(data.uid);	// 执行预定函数
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
User.prototype.setLogout = function ( uid, callback ) {
	var that = this;

	that.setOffline(uid, function(){
		that.deleteKey(uid);
		that.lib.comm.deleteUserData(uid);
		callback(that.lib.comm.successData());
	});
}



module.exports = new User();

