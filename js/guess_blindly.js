

function GuessBlindly ( account ) {

	this.comm = new Comm();

	this.socket = this.sio();

	this.data = null;
}


// 长连接
GuessBlindly.prototype.sio = function () {
	var socket = io.connect();

	socket.on('message', function(data){

		console.log('服务器发来信息：', data);

		// socket.send('我是客户端');

	});

	socket.on('disconnect', function(){
		console.log('与服务器断开连接');
	});

	socket.on('send nickname', function(userinfo){
		console.log('我的信息：', userinfo);
	});

	// 获取到数据后的操作
	socket.on('send guess blindly', function(data){
		for ( var key in data ) {
			$('.temp[key='+ key +']').find('span').html(data[key].number);
		}
	});

	// 获取到单个数据后的操作
	socket.on('send guess blindly item', function(data){
		$('.temp[key='+ data.key +']').find('span').html(data.number);
	});

	// socket.on('login', '账号')

	// socket.on('say success', function(msg){
	// 	console.log('留言板:', msg);
	// });

	socket.emit('get guess blindly');	// 向后台发送数据请求

	return socket;
}


// 进入用户指定功能
GuessBlindly.prototype.opt = function ( value, userkey, callback ) {
	this.comm.use(function(data){
		if ( callback )
			callback(data);
	},{
		_: '001add',
		key: value,
		userkey: userkey
	});
}


// 进入用户指定功能
GuessBlindly.prototype.init = function ( userkey ) {
	var that = this;

	// 获取规格
	this.comm.use(function(data){
		var area = $('#guess_blindly');
		area.show().find('.temp').remove();

		$(data).each(function(i, val){
			var temp = $('#qb_template').clone();
			i += 1;

			temp.attr('title', i).attr('key', i).show().addClass('temp').removeAttr('id');
			temp.click(function(){
				that.socket.emit('opt guess blindly', {
					key: i,
					userkey: userkey
				});
			});
			area.append(temp);
		});

		// 获取数据
		that.socket.emit('get guess blindly');
	}, {
		_:'001',
		userkey: userkey
	});
}

