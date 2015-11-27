

function UI ( account ) {


	this.lib = funs;
}


// 初始化登录界面事件
UI.prototype.initEntryEvent = function () {
	var that = this;
	
	// 登陆事件
	$('#enteny').submit(function(){
		return that.lib.user.setEntry({ account: that.account.value });
	})
}


// 初始化功能的进入按钮
UI.prototype.initFunsBtn = function () {
	var that = this;

	$('.itemUI').click(function(){
		var el = $(this);

		if ( !el.hasClass('itemAct') ) {
			el.siblings('.itemUI').hide();
			el.addClass('itemAct').stop().animate({ width: '100%' }, 500, function(){
				el.find('.close').show();
				that.lib[el.attr('key')].init();
			});
		}
	});

	$('.itemUI .close').click(function(){
		var el = $(this).parents('.itemUI');
		if ( el.hasClass('itemAct') ) {
			$('.contentUI').hide();
			el.find('.close').hide();
			el.removeClass('itemAct').stop().animate({ width: '300px' }, 500, function(){
				$('.allUI').append(el.siblings().show());
			});
		}
		return false;
	});
}


// 注销操作 - 设置页面为登录注册界面
UI.prototype.toEntry = function () {
	var entryEl = $('.entryUI').show(),
		that = this;

	entryEl.find('#account').val('');
	entryEl.find('#btn').unbind('click').bind('click', function(){
		that.lib.user.setEntry({ account: entryEl.find('#account').val() });
	});

	$('.userUI,.allUI,.contentUI').hide();	// 隐藏用户信息	// 隐藏所有功能列表	// 隐藏所有功能界面
	$('.itemUI').removeClass('itemAct').removeAttr('style');	// 关闭已打开的界面

	$('.itemUI .close').removeAttr('style');
}


// 注销操作 - 设置页面为登录注册界面
UI.prototype.toUser = function () {
	var userEI = $('.userUI').show(),
		that = this,
		user = that.lib.user;

	userEI.find('.name').html(user.name());
	userEI.find('.sum').html(user.sum());
	userEI.find('.logout').one('click', function(){
		that.lib.user.setLogout();
	});

	$('.entryUI').hide();
	$('.allUI').show();		// 登录成功后显示功能列表
}


// 界面提示
UI.prototype.text = function ( value ) {
	var el = $('#prompt');

	if ( value ) {
		el.show();
		el.find('.text').html('提示：' + value);
	} else {
		el.hide();
	}

	el.find('.close').unbind('click').click(function(){
		el.hide();
	});
}


// 界面加载中
UI.prototype.load = function ( value ) {
	var el = $('#loading');

	if ( value ) {
		el.show();
	} else {
		el.hide();
	}
}















