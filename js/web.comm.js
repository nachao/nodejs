

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
				if ( callback )
					callback(JSON.parse(res).data);
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
	}


	// 设置登录注册界面
	uxUser.prototype.setEntryUI = function () {
		var el = this.getInitUI('entry'),
			that = this;

		el.find('#account').val('');
		el.find('#btn').one('click', function(){
			that.setEntry({ account: el.find('#account').val() });
		});
	}


	// 用户注销
	uxUser.prototype.setLogout = function () {
		var that = this;

		this.get('logout', { key: this.userinfo.key }, function(data){
			if ( data.msg == 'success' ) {
				that.setEntryUI();
				that.userinfo = null;		// 保存数据到功能中
				that.setCookie(data.key);	// 保存数据到缓存中，持续24小时
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

