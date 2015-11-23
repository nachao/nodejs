
// 未命名
function GuessBlindly () {


	this.record = {};

	this.init();
}


// 初始化
GuessBlindly.prototype.init = function () {
	for ( var i = 1; i <= 9; i++ ) {
		this.record[i] = {
			number: 0,
			user: []
		};
	}
}


// 选择
GuessBlindly.prototype.opt = function ( userkey, key ) {
	this.record[key].number += 1;

	if ( this.record[key].user.indexOf(userkey) < 0 ) {
		this.record[key].user.push(userkey);
	}

	return this.get();
}


// 获取
GuessBlindly.prototype.get = function () {
	var result = [];

	for ( var key in this.record ) {
		result.push(this.record[key].number);
	}

	return result;
}







module.exports = new GuessBlindly();