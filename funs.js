
// 引用所有需要使用到的库
function Funs () {


	/*
	* 	引用node模板
	*
	*	private
	*/
	this.mysql = require('mysql');

	this.http = require('http');

	this.path = require('path');

	this.url = require('url');

	this.fs = require('fs');


	/*
	* 	引用自定义公共模板
	*
	*	private
	*/
	// this.comm = require('./funs/comm/lib.comm');

	// this.user = require('./funs/user/lib.user');

	// this.mysql = require('./funs/mysql/lib.mysql');


	/*
	* 	引用自定义功能模板
	*
	*	private
	*/
	this.ux001 = require('./funs/001/lib.001');

	this.ux002 = require('./funs/002/lib.002');


	// console.log('new funs...');
}


module.exports = new Funs();