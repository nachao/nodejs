
// 未命名
function Ux002 () {

	this.lib = funs;

	this.param = {};

	this.param.once = 60;

	this.param.el = $('#ux002');


	var that = this;

	// 绑定领取按钮事件
	$('#ux002 .taken').click(function(){
		that.receive();
	});

}


// 进入界面 - 初始化显示数据 
Ux002.prototype.init = function () {
	var that = this;

	this.lib.comm.api('ux002', 'update', function(res){
		if ( res.status == 200 ) { 
			that.set(res.data);
			that.cartoon(that.count(), function(){

				this.lib.comm.api('ux002', 'update', {
					msg: '挂机开始'
				});

				that.update();
				return that.count();
			});
		}
	}, {
		msg: '进入挂机界面'
	});
}


// 进入界面 - 开始计时并获取初始数据
Ux002.prototype.start = function () {
	this.lib.comm.api('ux002', 'update', {
		msg: '挂机开始'
	});
}


// 设置参数
Ux002.prototype.set = function ( data ) {
	for ( var key in data ) {
		this.param[key] = data[key];
	}
}


// 获取计算后的参数
Ux002.prototype.count = function () {
	var data = this.param,
		once = data.once,
		number = parseInt(data.current / once),
		have = data.current - number * once;

	return {
		number: number,
		percent: have / once,
		surplus: once - have
	}
}


// 更新当前总值参数
Ux002.prototype.update = function () {
	this.set({
		current: this.param.current + this.count().surplus
	});
}


// 清零
Ux002.prototype.reset = function () {
	this.set({
		current: this.count().surplus
	});
}


// 领取
Ux002.prototype.receive = function () {
	var that = this;

	if ( that.count().number > 0 ) {
		that.lib.comm.api('ux002', 'receive', function(res){
			if ( res.status == 200 ) {
				$('#ux002 .number').html(0);
				that.reset();
				that.lib.user.income(res.data.add);
			}
		}, {
			msg: '领取挂机积分'
		});
	}
}


// 循环动画
Ux002.prototype.cartoon = function ( data, callback ) {
	var that = this,
		el = $('#ux002').show();

	el.find('.number').html(data.number);
	el.find('.line').stop().css({ width: (data.percent * 100) + '%' });
	el.find('.line').stop().animate({ width: '100%' }, data.surplus * 1000, 'linear', function(){
		var data = {};

		if ( callback )
			data = callback();

		that.cartoon(data, callback);
	});

	if ( data.number >= 100 ) {
		return;
	}
}




