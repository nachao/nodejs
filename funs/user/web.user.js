

function User ( account ) {

	this.param = {};

	this.param.cookieAccountKey = 'ux';


	// 登陆成功后执行
	this.param.begin = $.noop;

	// 登陆成功后执行
	this.param.end = $.noop;

	// 登陆成功后执行
	this.param.entry = $.noop;

	// 登陆失败
	this.param.failed = $.noop;

	// 注销后执行
	this.param.logout = $.noop;


	this.userinfo = {};


	this.comm = new Comm();

	this.lib = funs;



	// 如果有缓存则登录，没有则打开登录界面
	this.cookieEntry();

	// 初始化部分事件
	this.entryStart();

	this.entryFailed();

	this.entryEnd();
}




// 显示指定的界面
User.prototype.get = function ( key ) {
	var result = null;

	if ( key ) {
		result = this.userinfo[key]
	} else if ( this.userinfo ) {
		result = this.userinfo;
	}

	return result;
}


// 显示指定的界面
User.prototype.info = function () {
	return this.userinfo;
}


// 显示指定的界面
User.prototype.uid = function () {
	return this.userinfo.uid;
}


// 显示指定的界面
User.prototype.name = function () {
	return this.userinfo.name || '-';
}


// 显示指定的界面
User.prototype.sum = function ( value ) {
	if ( value ) {
		this.userinfo.sum = value;
		$('.userUI .sum').html(value[key]);
	}
	return this.userinfo.sum || '0';
}





// 用户注销
User.prototype.setLogout = function () {
	var that = this;

	that.comm.on(function(res){
		if ( res.status == '200' ) {
			that.param.logout();
			that.userinfo = null;	// 删除功能数据
			that.delCookie();	// 注销缓存
		}
	}, {
		logout: that.uid()
	});
}


// 用户登录注册
User.prototype.setEntry = function ( param ) {
	var that = this;

	that.param.begin();

	that.comm.on(function(res){

		// 后台返回登陆成功时
		if ( res.status == '200' ) {
			that.userinfo = res.data;						// 保存数据到功能中
			that.setCookie(res.data.uid, res.data.key);		// 保存数据到缓存中，持续24小时
			that.param.entry();

		// 后台返回登陆失败时
		} else {
			that.userinfo = null;
			that.delCookie(null);
			that.param.failed(res.msg);
		}

		that.param.end();

	}, param);

	return false;
}


// 登陆确认时执行
User.prototype.entryStart = function ( callback ) {
	var that = this;

	callback = callback || function(){
		that.lib.ui.load(true);
	};

	this.param.begin = callback;
}


// 用户登录注册成功后执行
User.prototype.entrySuccess = function ( callback ) {
	this.param.entry = callback;
}


// 用户登录失败后执行
User.prototype.entryFailed = function ( callback ) {
	var that = this;

	callback = callback || function(msg){
		that.lib.ui.text(msg);
		that.lib.ui.toEntry();
	};

	this.param.failed = callback;
}


// 登陆完成时执行
User.prototype.entryEnd = function ( callback ) {
	var that = this;

	callback = callback || function(){
		that.lib.ui.load(false);
	};

	this.param.end = callback;
}


// 用户注销成功后执行
User.prototype.logoutSuccess = function ( callback ) {
	this.param.logout = callback;
}

// 设置用户参数
User.prototype.getUserInfo = function ( value ) {
	for ( var key in value ) {
		this.userinfo[key] = value[key];

		if ( key == 'sum' ) {
			$('.userUI .sum').html(value[key]);
		}
		if ( key == 'name' ) {
			$('.userUI .name').html(value[key]);
		}
	}
}


// 获取用户缓存数据
User.prototype.cookieEntry = function () {
	var value = this.getCookie();

	if ( value ) {
		this.setEntry({ cache: value.uid, key: value.key });
	}
}


// 删cookies
User.prototype.delCookie = function () {
	document.cookie = this.param.cookieAccountKey + "=null;expires=" + new Date().toGMTString();
}


// 写cookies
User.prototype.setCookie = function ( uid, key ) {
	var exp = new Date();

	exp.setTime(exp.getTime() + (60 * 60 * 24 * 1000));

	document.cookie = this.param.cookieAccountKey + '='+ uid +"&"+ key +";expires=" + exp.toGMTString();
}


// 读取cookies
User.prototype.getCookie = function ( key ){
	key = key || this.param.cookieAccountKey;
	var arr, val,
		reg = new RegExp("(^| )"+ key +"=([^;]*)(;|$)");

	if ( arr = document.cookie.match( reg ) ) {
		val = String(arr[2]).split('&');
		return {
			uid: val[0],
			key: val[1]
		};
	} else {
		return null;
	}
}

