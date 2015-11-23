

	function uxUser ( account ) {

		this.param = {};

		this.param.cookieAccountKey = 'ux';

		this.userinfo = null;
	}


	// 获取用户信息，如果没有则会创建新用户并返回
	uxUser.prototype.get = function ( key, param, callback ) {
		var that = this,
			data = '';

		if ( !key ) {
			return;
		}
		if ( param ) {
			for ( var k in param ) {
				data += '&'+ k +'='+ param[k];
			}
		}

		$.ajax({
			url: 'http://localhost:8081',
			data: '_='+ key + data,
			success: function ( res ) {
				res = JSON.parse(res);
				if ( callback )
					callback(res.data, res);
			}
		});
	}


	// 显示指定的界面
	uxUser.prototype.getInitUI = function ( key ) {
		$('.UI').hide();

		return $('.'+ key +'UI').show();
	}


	// 修改页面用户信息
	uxUser.prototype.setUserUI = function ( info ) {
		var el = this.getInitUI('user'),	
			that = this;

		el.find('.name').html(info.name || '-');
		el.find('.sum').html(info.sum || '-');
		el.find('.logout').one('click', function(){
			that.setLogout();
		});

		$('.allUI').show();	// 登录成功后显示功能列表
	}


	// 设置登录注册界面
	uxUser.prototype.setEntryUI = function () {
		var el = this.getInitUI('entry'),
			that = this;

		el.find('#account').val('');
		el.find('#btn').unbind('click').bind('click', function(){
			that.setEntry({ account: el.find('#account').val() });
		});

		$('.allUI').hide();	// 注销成功后显示功能列表
	}


	// 用户注销
	uxUser.prototype.setLogout = function () {
		var that = this;

		this.get('logout', { key: this.userinfo.key }, function(data, res){
			if ( res.msg == 'success' ) {
				that.setEntryUI();
				that.userinfo = null;	// 删除功能数据
				that.setCookie(null);	// 注销缓存
			}
		});
	}


	// 用户登录注册
	uxUser.prototype.setEntry = function ( param ) {
		var that = this;

		this.get('entry', param, function(data){
			if ( data && data.key ) {
				that.userinfo = data;						// 保存数据到功能中
				that.setCookie(data.key, 60 * 60 * 24);		// 保存数据到缓存中，持续24小时
				that.setUserUI(data);
			} else {
				that.userinfo = null;		// 保存数据到功能中
				that.setCookie(data.key);	// 保存数据到缓存中，持续24小时
				that.setEntryUI();
				alert('请重新登录！');
			}
		});

		return false;
	}


	// 获取用户缓存数据
	uxUser.prototype.getUserByCookie = function () {
		var key = this.getCookie();

		if ( key ) {
			this.setEntry({ key: key });
		} else {
			this.setEntryUI();
		}

		return key;
	}


	// 进入用户指定功能
	uxUser.prototype.getFunction = function ( key, callback ) {
		this.get(key, {
			userkey: this.userinfo.key
		}, function(data){
			console.log(data);
			if ( callback )
				callback(data);
		});
	}


	// 进入用户指定功能
	uxUser.prototype.setFunction = function ( key, callback ) {
		this.get(key, {
			userkey: this.userinfo.key
		}, function(data){
			console.log(data);
			if ( callback )
				callback(data);
		});
	}


	// 写cookies
	uxUser.prototype.setCookie = function ( value, time, key ) {
		key = key || this.param.cookieAccountKey;
		time = time || 0;
		var exp = new Date();
		exp.setTime(exp.getTime() + time * 1000);
		document.cookie = key + "="+ escape(value) + ";expires=" + exp.toGMTString();
	}


	// 读取cookies
	uxUser.prototype.getCookie = function ( key ){
		key = key || this.param.cookieAccountKey;
		var arr,
			reg = new RegExp("(^| )"+ key +"=([^;]*)(;|$)");
		if ( arr = document.cookie.match( reg ) )
			return unescape(arr[2]);
		else
			return null;
	}

