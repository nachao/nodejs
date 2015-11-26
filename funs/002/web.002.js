
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


	// this.lib.socket.set('inits');

	console.log('Ux002.prototype.init...');


}


// 长连接
Ux002.prototype.initSocket = function () {
	var that = this;


	// 获取初始化数据
	that.lib.socket.get('entry data', function(res){
		console.log(res, parseInt(res.data.total / 60), '分钟');

		// socket.set('data', '服务端你好！');
	});


	// console.log('Ux002.prototype.initSocket...');
}


// 长连接
Ux002.prototype.login = function () {
	this.lib.socket.send('logout', this.lib.user.key());
}