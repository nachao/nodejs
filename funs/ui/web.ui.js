

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