

function Ux001 ( account ) {

	this.comm = new Comm();


	this.lib = funs;


	this.data = null;




	// this.initSocket();
}


// 长连接
Ux001.prototype.initSocket = function () {

	// var socket = io.connect('localhost:8080');

	var that = this;

	// 进入登记
	// socket.emit('Identity', this.user.get(), function(){});

	// socket.on('message', function(data){
	// 	console.log('server.web::', data);
	// });

	// 获取倒计时请求
	that.lib.socket.set('get count down');	

	that.lib.socket.get('disconnect', function(){
		socket.emit('disconnect', '123');
		console.log('与服务器断开连接');
	});

	// 刷新用户积分
	that.lib.socket.get('send userinfo sum', function(number){
		that.lib.user.getUserInfo({
			sum: number
		});

		if ( number <= 0 ) {
			$('#guess_blindly .warn').show();
		} else {
			$('#guess_blindly .warn').hide();
		}
	})

	// 获取到单个数据后的操作
	that.lib.socket.get('send guess blindly item', function(data){
		$('.temp[key='+ data.key +']').find('span').html(data.number);
	});

	// 界面样式
	that.lib.socket.get('set interface data', function(data){

		// 设置每个选项的选择数量
		for ( var key in data.record ) {
			$('.temp[key='+ key +']').find('span').html(data.record[key].number);
		}
	});

	// 倒计时样式
	that.lib.socket.get('set count down', function(data){
		if ( data.status ) {

			// 设置时间倒数计时效果
			var time = data.endTime - new Date().getTime(),
				el = $('#ux001 .line');

			el.show().css({ width: (new Date().getTime() - data.startTime) / data.totalTime * 100 + '%', backgroundColor: '' });
			el.stop().animate({ height: '2px' }).animate({ width: '100%' }, time, 'linear', function(){
				$(this).hide();
			});
		}
	});

	// 初始化界面
	that.lib.socket.get('initialise', function(data){

		if ( !data.status ) {
			return;

		} else {

			// 设置每个选项的选择数量
			for ( var key in data.record ) {
				$('.temp[key='+ key +']').removeClass('temp-act').find('span').html(data.record[key].number);
			}

			// 设置时间倒数计时效果
			var time = data.endTime - new Date().getTime(),
				el = $('#ux001 .line');

			el.show().css({ width: (new Date().getTime() - data.startTime) / data.totalTime * 100 + '%', backgroundColor: '' });
			el.stop().animate({ height: '2px' }).animate({ width: '100%' }, time, 'linear', function(){
				$(this).hide();
			});
		}
	});

	// 公布
	that.lib.socket.get('reveal answer', function(key, data){
		$('.temp[key='+ data.key +']').addClass('temp-act');

		if ( data[that.lib.user.get('key')] ) {
			that.lib.user.getUserInfo({
				sum: that.lib.user.get('sum') + data[that.lib.user.get('key')].b
			});
		}
	});
}


// 进入用户指定功能
Ux001.prototype.opt = function ( value, userkey, callback ) {
	this.comm.use(function(data){
		if ( callback )
			callback(data);
	},{
		_: '001add',
		key: value,
		userkey: userkey
	});
}


// 让当前用户持续点击
Ux001.prototype.analogClick = function () {
	var key = parseInt(Math.random() * 9) || 1,
		that = this;

	$('.temp[key='+ key +']').click();

	if ( that.lib.user.get('sum') > 0 ) {
		setTimeout(function(){
			that.analogClick();
		}, 1000);
	}
}


// 进入用户指定功能
Ux001.prototype.init = function () {
	var that = this;

	// 获取规格
	this.comm.use(function(data){
		var main = $('#guess_blindly').show();

		var areaEl = main.find('.area'),
			warnEl = areaEl.find('.warn');

		areaEl.find('.temp').remove();

		$(data).each(function(key, val){
			var temp = $('#qb_template').clone();
			key += 1;

			temp.attr('title', key).attr('key', key).show().addClass('temp').removeAttr('id');
			temp.click(function(){
				if ( that.lib.user.sum() > 0 ) {
					that.lib.socket.set('set an option', {
						key: key,
						user: that.lib.user.info()
					});
					warnEl.hide();
				} else {
					console.warn('sum not enough!');
					warnEl.show();
				}
			});
			areaEl.append(temp);
		});

		// 获取数据
		// that.socket.emit('get guess blindly');

		// 获取界面数据
		that.lib.socket.set('get interface data');

		// 判断用户是否可用
		if ( that.lib.user.sum() <= 0 ) {
			$('#guess_blindly .warn').show();
		} else {
			$('#guess_blindly .warn').hide();
		}
	}, {
		_:'001',
		userkey: that.lib.user.key()
	});
}

