
// 未命名
function Ux002 () {

	this.lib = funs;


	this.initEvent();

}


// 进入界面 - 初始化显示数据 
Ux002.prototype.init = function () {
	var that = this;

	that.lib.comm.on(function(res){
		that.setCartoon(res.data);
	}, {
		ux002: that.lib.user.uid()
	});
}


// 进入界面 - 界面事件
Ux002.prototype.initEvent = function () {
	var that = this;

	// 领取按钮
	$('#ux002 .taken').click(function(){
		that.getIntegral();
	})

}


// 循环动画
Ux002.prototype.setCartoon = function ( data ) {
	var that = this;

	var el = $('#ux002').show();

	var once = 60,
		number = parseInt(data.total / once);

	var all = once,
		has = data.total - number * all,
		not = all - has;

	el.find('.number').html(number)
	el.find('.line').stop().css({ width: (has / all * 100) + '%' }).animate({ width: '100%' }, not * 1000, 'linear', function(){
		data.total += not;
		that.setCartoon(data);
	});
}


// 领取
Ux002.prototype.getIntegral = function () {
	this.lib.socket.send('get integral', this.lib.user.uid());
}








