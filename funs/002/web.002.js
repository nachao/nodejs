
// 未命名
function Ux002 () {

	this.lib = funs;


	this.initSocket();

}


// 初始化
Ux002.prototype.init = function () {
	var that = this;

	// this.lib.comm.use(function(data){

	// 	console.log(data);

	// }, {
	// 	ux002: this.lib.user.key()
	// });




	// 向后台请求数据
	this.lib.socket.send('get data', this.lib.user.key());

	// console.log('Ux002.prototype.init...');


}


// 长连接
Ux002.prototype.initSocket = function () {
	var that = this;


	// 获取初始化数据
	this.lib.socket.on('data', function(res){
		// console.log(res);
		var data = res.data,
			number = parseInt(data.total / 60 / 15);

		var all = 60 * 15,
			has = data.total - number * all,
			not = all - has;

		var el = $('#ux002').show();

		el.find('.number').html(number)
		el.find('.line').stop().css({ width: (has / all * 100) + '%' }).animate({ width: '100%' }, not * 1000, 'linear');
	});


	// 获取初始化数据
	// that.lib.socket.get('data', function(res){
	// 	console.log('---------');
	// 	console.log(res, parseInt(res.data.total / 60), '分钟');

	// 	// socket.set('data', '服务端你好！');
	// });

	// console.log('Ux002.prototype.initSocket...');
}


// 长连接
Ux002.prototype.login = function () {
	this.lib.socket.send('logout', this.lib.user.key());
}