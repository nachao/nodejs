
// 未命名
function Ux002 () {

	this.lib = funs;


	this.initSocket();

}


// 初始化
Ux002.prototype.init = function () {
	// this.lib.comm.use(function(data){

	// 	console.log(data);

	// }, {
	// 	ux002: this.lib.user.key()
	// });


	this.lib.socket.set('ux002');
}


// 长连接
Ux002.prototype.initSocket = function () {

	// var socket = io.connect('localhost:8080');

	// 进入登记
	// socket.emit('Identity', this.user.get(), function(){});

	// socket.on('message', function(data){
	// 	console.log('server.web::', data);
	// });

	// 获取倒计时请求
	// socket.emit('get count down');	

	// socket.on('disconnect', function(){
	// 	console.log('与服务器断开连接');
	// });

	// 刷新用户积分
	// socket.on('send userinfo sum', function(number){
	// 	user.getUserInfo({
	// 		sum: number
	// 	});

	// 	if ( number <= 0 ) {
	// 		$('#guess_blindly .warn').show();
	// 	} else {
	// 		$('#guess_blindly .warn').hide();
	// 	}
	// })

	// 获取到单个数据后的操作
	// socket.on('send guess blindly item', function(data){
	// 	$('.temp[key='+ data.key +']').find('span').html(data.number);
	// });

	// 界面样式
	// socket.on('set interface data', function(data){

		// 设置每个选项的选择数量
	// 	for ( var key in data.record ) {
	// 		$('.temp[key='+ key +']').find('span').html(data.record[key].number);
	// 	}
	// });

	// 倒计时样式
	// socket.on('set count down', function(data){
	// 	if ( data.status ) {

	// 		// 设置时间倒数计时效果
	// 		var time = data.endTime - new Date().getTime(),
	// 			el = $('#ux001 .line');

	// 		el.show().css({ width: (new Date().getTime() - data.startTime) / data.totalTime * 100 + '%', backgroundColor: '' });
	// 		el.stop().animate({ height: '2px' }).animate({ width: '100%' }, time, 'linear', function(){
	// 			$(this).hide();
	// 		});
	// 	}
	// });

	// 初始化界面
	// socket.on('initialise', function(data){

	// 	if ( !data.status ) {
	// 		return;

	// 	} else {

	// 		// 设置每个选项的选择数量
	// 		for ( var key in data.record ) {
	// 			$('.temp[key='+ key +']').removeClass('temp-act').find('span').html(data.record[key].number);
	// 		}

	// 		// 设置时间倒数计时效果
	// 		var time = data.endTime - new Date().getTime(),
	// 			el = $('#ux001 .line');

	// 		el.show().css({ width: (new Date().getTime() - data.startTime) / data.totalTime * 100 + '%', backgroundColor: '' });
	// 		el.stop().animate({ height: '2px' }).animate({ width: '100%' }, time, 'linear', function(){
	// 			$(this).hide();
	// 		});
	// 	}
	// });

	// 公布
	// socket.on('reveal answer', function(key, data){
	// 	$('.temp[key='+ data.key +']').addClass('temp-act');

	// 	if ( data[user.get('key')] ) {
	// 		user.getUserInfo({
	// 			sum: user.get('sum') + data[user.get('key')].b
	// 		});
	// 	}
	// });

	// that.lib.socket.set('ux002');

	// return socket;
}