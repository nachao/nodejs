
/*
*	此文件主要用户前端的Ajax数据请求。
*
*	@ auther Na Chao
*	@ data 15-11-21
*/
function ServerAjax () {

	this.lib = require('../funs');

	// 引用专属功能
	// this.lib.comm = require('./core');

	// this.lib.c001 = require('./libc.001');	// --

	// this.lib.mysql = require('./libc.mysql');	// mysql 数据管理


	this.lib.mysql.init();

	this.init();

	console.log('node ajax...');
}



ServerAjax.prototype.init = function(first_argument) {

	// 引用全部会使用到的模块
	var url = require('url'),
		http = require("http");

	var that = this;


	// 创建服务对象
	var server = http.createServer(function(req, res){

		var info = url.parse(req.url, true),
			query = info.query;	// 用户请求的参数

		console.log(query);

		if ( req.url =="/favicon.ico" ) {
			return;
		}

		// 说明
		res.writeHead(200, {
			"Content-Type": "text/plain;charset=utf-8",
			"Access-Control-Allow-Origin": "*"
		});

		// 调用专属功能 - 获取并判断用户操作
		that.getUse(info.query, function(data){
			res.write(data);
			res.end();
		});

	}).listen(8081, "localhost", function(){

		console.log('localhost:8081...');
	});	// 开启服务端口
}


ServerAjax.prototype.getUse = function ( query, callback ) {
	var result = null,
		that = this;

		callback = callback || function (){};

	// 缓存登录
	if ( query.cache ) {	// query._ == 'entry' && 
		that.lib.mysql.userSelectByKey(query.cache, function(data){	// 根据Key获取用户信息
			if ( data ) {
				that.lib.comm.saveUserData(data);
				that.lib.mysql.setUserStatus(query.cache, '1');		// 设置用户为在线状态
				result = that.lib.comm.getSuccessData(data);
			} else {
				result = that.lib.comm.getErrerData();
			}
			callback(result);
		});

	// 登录或注册
	} else if ( query.account ) {	// query._ == 'entry' && 
		that.lib.mysql.userSelect(query.account, function(data){	// 根据Name获取用户信息
			if ( data ) {
				that.lib.comm.saveUserData(data);
				that.lib.mysql.setUserStatus(query.userkey, '1');		// 设置用户为在线状态
				callback(that.lib.comm.getSuccessData(data));
			} else {
				that.lib.mysql.userCreate(query.account, function(data){	// 如果没获取到，则根据给定的账户名创建新账号
					if ( data ) {
						result = that.lib.comm.getSuccessData(data);
					} else {
						result = that.lib.comm.getErrerData();
					}
					callback(result);
				});
			}
		});

	// 退出登录
	} else if ( query._ == 'logout' && query.userkey ) {
		that.lib.mysql.setUserStatus(query.userkey, '0', function(){
			that.lib.comm.deleteUserData(query.userkey);
			callback(that.lib.comm.getSuccessData());
		});

	// 进入功能 001
	} else if ( query._ == '001' && query.userkey ) {
		callback(that.lib.comm.getSuccessData(that.lib.ux001.getRecord()));

	// 操作 001
	} else if ( query._ == '001add' && query.userkey && query.key ) {
		callback(that.lib.comm.getSuccessData(that.lib.ux001.opt(query.userkey, query.key)));

	// 无对应的后台操作
	} else {
		callback(that.lib.comm.getErrerData());
	}

}





module.exports = new ServerAjax();

