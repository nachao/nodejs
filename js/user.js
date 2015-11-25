

function User ( account ) {

	this.param = {};

	this.param.cookieAccountKey = 'ux';

	this.param.callback = $.noop;


	this.userinfo = {};


	this.comm = new Comm();
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
User.prototype.key = function ( key ) {
	return this.userinfo[key];
}


// 显示指定的界面
User.prototype.getInitUI = function ( key ) {
	$('.UI').hide();

	return $('.'+ key +'UI').show();
}


// 修改页面用户信息
User.prototype.setUserUI = function ( info ) {
	var el = this.getInitUI('user'),	
		that = this;

	el.find('.name').html(info.name || '-');
	el.find('.sum').html(info.sum || '0');
	el.find('.logout').one('click', function(){
		that.setLogout();
	});

	$('.allUI').show();	// 登录成功后显示功能列表
}


// 设置登录注册界面
User.prototype.setEntryUI = function () {
	var el = this.getInitUI('entry'),
		that = this;

	el.find('#account').val('');
	el.find('#btn').unbind('click').bind('click', function(){
		that.setEntry({ account: el.find('#account').val() });
	});

	$('.allUI').hide();	// 注销成功后显示功能列表
	$('.contentUI').hide();	// 隐藏所有功能
}


// 用户注销
User.prototype.setLogout = function () {
	var that = this;

	this.comm.use(function(data, res){
		if ( res.msg == 'success' ) {
			that.setEntryUI();
			that.userinfo = null;	// 删除功能数据
			that.setCookie(null);	// 注销缓存
		}
	}, 'logout');
}


// 用户登录注册
User.prototype.setEntry = function ( param ) {
	var that = this;

	param._ = 'entry';

	$('#loading').show();

	this.comm.use(function(data){
		if ( data && data.key ) {
			that.userinfo = data;						// 保存数据到功能中
			that.setCookie(data.key, 60 * 60 * 24);		// 保存数据到缓存中，持续24小时
			that.setUserUI(data);
			that.param.callback();		// 登录成功后执行
		} else {
			that.userinfo = null;		// 保存数据到功能中
			that.setCookie(data.key);	// 保存数据到缓存中，持续24小时
			that.setEntryUI();
			// alert('请重新登录！');
		}

		$('#loading').hide();
	}, param);

	return false;
}


// 用户登录注册
User.prototype.setRight = function ( callback ) {
	this.param.callback = callback;
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
User.prototype.getUserByCookie = function () {
	var key = this.getCookie();

	if ( key ) {
		this.setEntry({ userkey: key });
	} else {
		this.setEntryUI();
	}

	return key;
}


// 写cookies
User.prototype.setCookie = function ( value, time, key ) {
	key = key || this.param.cookieAccountKey;
	time = time || 0;
	var exp = new Date();
	exp.setTime(exp.getTime() + time * 1000);
	document.cookie = key + "="+ escape(value) + ";expires=" + exp.toGMTString();
}


// 读取cookies
User.prototype.getCookie = function ( key ){
	key = key || this.param.cookieAccountKey;
	var arr,
		reg = new RegExp("(^| )"+ key +"=([^;]*)(;|$)");
	if ( arr = document.cookie.match( reg ) )
		return unescape(arr[2]);
	else
		return null;
}

