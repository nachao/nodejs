
/*
*	此文件主要用户前端的Ajax数据请求。
*
*	@ auther Na Chao
*	@ data 15-11-21
*/
function ServerAjax () {



	this.lib = require('../funs');


	/*
	* 	引用自定义公共模板
	*
	*	private
	*/
	// this.lib.comm = require('../funs/comm/lib.comm');

	// this.lib.user = require('../funs/user/lib.user');

	// this.lib.mysql = require('../funs/mysql/lib.mysql');


	this.lib.mysql.init();

	this.init();


	// 简单外部方法
	this.success = this.lib.comm.successJSON;

	// 提示
	console.log('node ajax...');

}



ServerAjax.prototype.init = function(first_argument) {

	// 引用全部会使用到的模块
	var url = require('url'),
		http = require("http");

	var that = this;

	this.lib.a = 2;


	// 创建服务对象
	var server = http.createServer(function(req, res){

		var info = url.parse(req.url, true),
			query = info.query;	// 用户请求的参数

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

			console.log('-----------------', new Date());
			console.log(query);
			console.log(data);

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
	if ( query.cache ) {
		that.lib.user.keyEntry(query.cache, query.key, function(res){	// 根据Key获取用户信息
			if ( res.status == 200 ) {
				that.lib.ux002.setOnline(res.data.uid);		// 通知功能
			}
			callback(JSON.stringify(res));
		});

	// 登录或注册
	} else if ( query.account ) {
		that.lib.user.nameEntry(query.account, function(res){
			if ( res.status == 200 ) {
				that.lib.ux002.setOnline(res.data.uid);		// 通知功能
			}
			callback(JSON.stringify(res));
		});

	// 退出登录
	} else if ( query.logout ) {
		that.lib.user.setLogout(query.logout, function(res){
			if ( res.status == 200 ) {
				that.lib.ux002.setOffline(query.logout);	// 通知功能
			}
			callback(JSON.stringify(res));
		})

	// 进入功能 001
	} else if ( query._ == '001' && query.userkey ) {
		callback(that.lib.comm.successJSON(that.lib.ux001.getRecord()));

	// 操作 001
	} else if ( query._ == '001add' && query.userkey && query.key ) {
		callback(that.lib.comm.successJSON(that.lib.ux001.opt(query.userkey, query.key)));

	// 进入功能 002
	} else if ( query.ux002 ) {
		// var ux002 = that.lib.ux002,
		// 	userkey = query.ux002;

		// ux002.getDayLog(userkey, function(data){
		// 	if ( !data ) {
		// 		data = ux002.addDayLog(userkey);	// 如果是当日首次登录则创建记录并返回记录信息
		// 	} else if ( data.time_start == '0' ) {
		// 		ux002.updateEntry(userkey);			// 如果是当日再次登录则刷新记录
		// 	}
		// 	callback(that.success(data));
		// });

		console.log(' ----------- get into', query.ux002);

		that.lib.ux002.getLog(query.ux002, function(data){
			that.lib.ux002.updateValue(query.ux002, data, function(data){
				callback(that.lib.comm.successJSON(data));
				console.log(' --- data', data);
			});
		});

	// 无对应的后台操作
	} else {
		callback(that.lib.comm.errerJSON());
	}

}


module.exports = new ServerAjax();

