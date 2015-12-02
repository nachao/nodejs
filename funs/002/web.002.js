
// 未命名
function Ux002 () {

	this.lib = funs;

	this.param = {};

	this.param.once = 60;

	this.param.el = $('#ux002');


	this.ui = new UI002();


	var that = this;

	// 绑定领取按钮事件
	this.ui.taken(function(){
		that.receive();
	});

}


// 进入界面 - 初始化显示数据 
Ux002.prototype.init = function () {
	var that = this;

	// 获取数据
	// that.lib.comm.api('ux002', 'data', function(res){
	// 	if ( res.status == 200 ) { 
	// 		that.set(res.data);

	// 		var data = that.count();

	// 		console.log(data);

	// 		that.ui.cartoon(that.count(), function(){
	// 			that.update();
	// 			return that.count();
	// 		});
	// 	}
	// }, {
	// 	msg: '获取挂机数据'
	// });

	this.start();
}


// 进入界面 - 开始计时并获取初始数据
Ux002.prototype.start = function () {
	var that = this;

	that.lib.comm.api('ux002', 'startCurrent', function(res){
		if ( res.status == 200 ) { 
			that.set(res.data);	
			console.log(res);

			var data = that.count();

			console.log(data)

			that.

			that.ui.cartoon(that.count(), function(){
				that.update();
				return that.count();
			});
		}
	}, {
		msg: '开始计时'
	});
}


// 获取参数
Ux002.prototype.get = function ( key ) {
	return this.param[key];
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
		total = parseInt((data.total + data.current) / once),
		number = parseInt(data.current / once),
		have = data.current - number * once;

	return {
		total: total,
		number: number,
		percent: have / once,
		surplus: once - have
	}
}


// 更新当前总值参数
Ux002.prototype.update = function () {
	this.set({
		current: this.get('current') + this.count().surplus
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
		that.lib.comm.api('ux002', 'extract', function(res){
			if ( res.status == 200 ) {
				that.lib.user.income(res.data.number);
				that.ui.reset();
				that.reset();
			}
		}, {
			msg: '领取挂机积分'
		});
	}
}







// 挂机 - 样式
function UI002 () {

	this.el = $('#ux002');

	this.datas = {};


	var that = this;

}


// 清零
UI002.prototype.taken = function ( callback ) {
	// 领取按钮
	$('#ux002 .taken').click(callback);
}


// 设置显示值
UI002.prototype.setNumber = function ( number ) {
	this.el.find('.number').html(number);
}


// 循环动画
UI002.prototype.cartoon = function ( data, callback ) {
	var that = this,
		el = that.el.show();

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




