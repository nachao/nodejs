

function OnHook ( account ) {

	this.comm = new Comm();

	this.socket = this.sio();

	this.data = null;
}


// 长连接
OnHook.prototype.sio = function () {

	var socket = io.connect('localhost:8080');

	// 进入登记
	socket.emit('Identity', user.get(), function(){});

	// socket.on('message', function(data){
	// 	console.log('server.web::', data);
	// });

	// 获取倒计时请求
	socket.emit('get count down');	

	socket.on('disconnect', function(){
		console.log('与服务器断开连接');
	});

	// 刷新用户积分
	socket.on('send userinfo sum', function(number){
		user.getUserInfo({
			sum: number
		});

		if ( number <= 0 ) {
			$('#guess_blindly .warn').show();
		} else {
			$('#guess_blindly .warn').hide();
		}
	})

	// 获取到单个数据后的操作
	socket.on('send guess blindly item', function(data){
		$('.temp[key='+ data.key +']').find('span').html(data.number);
	});

	// 界面样式
	socket.on('set interface data', function(data){

		// 设置每个选项的选择数量
		for ( var key in data.record ) {
			$('.temp[key='+ key +']').find('span').html(data.record[key].number);
		}
	});

	// 倒计时样式
	socket.on('set count down', function(data){
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
	socket.on('initialise', function(data){

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
	socket.on('reveal answer', function(key, data){
		$('.temp[key='+ data.key +']').addClass('temp-act');

		if ( data[user.get('key')] ) {
			user.getUserInfo({
				sum: user.get('sum') + data[user.get('key')].b
			});
		}
	});

	return socket;
}


// 进入用户指定功能
OnHook.prototype.opt = function ( value, userkey, callback ) {
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
OnHook.prototype.analogClick = function () {
	var key = parseInt(Math.random() * 9) || 1,
		that = this;

	$('.temp[key='+ key +']').click();

	if ( user.get('sum') > 0 ) {
		setTimeout(function(){
			that.analogClick();
		}, 1000);
	}
}


// 获取当前用户的信息
OnHook.prototype.getInfo = function ( userkey ) {
	var that = this;

	this.comm.use(function(data){
		console.log(data);

		var data = {
				number: 0,
				time: 0
			};

	}, {
		_:'002',
		userkey: userkey
	});
}


// 进入用户指定功能
OnHook.prototype.init = function ( userkey ) {

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
				if ( user.get('sum') > 0 ) {
					that.socket.emit('set an option', {
						key: key,
						user: user.get()
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
		that.socket.emit('get interface data');

		// 判断用户是否可用
		if ( user.get('sum') <= 0 ) {
			$('#guess_blindly .warn').show();
		} else {
			$('#guess_blindly .warn').hide();
		}
	}, {
		_:'001',
		userkey: userkey
	});
}

