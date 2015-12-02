

function Comm ( account ) {

	this.lib = funs;
}


// 获取用户信息，如果没有则会创建新用户并返回
Comm.prototype.on = function ( callback, value ) {
	var data = '';

	// 多个参数对象型
	if ( typeof(value) == 'object' ) {
		for ( var k in value ) {
			if ( data ) {
				data += '&';
			}
			if ( typeof value[k] == 'object' ) {
				value[k] = JSON.stringify(value[k]);
			}
			data += k +'='+ value[k];
		}

	// 无效参数
	} else {
		return;
	}

	$.ajax({
		url: 'http://localhost:8081',
		data: data,
		success: function ( res ) {
			res = JSON.parse(res);
			if ( callback && res )
				callback(res);
		}
	});
}


// 获取用户信息，如果没有则会创建新用户并返回
Comm.prototype.api = function ( module, call, callback, param ) {
	var data = '',
		value = {};

	param = param || {};

	if ( $.isPlainObject(callback) ) {
		param = callback;
		callback = null;
	}

	if ( this.lib.user.uid() && !param.uid && !param.key ) {
		param.uid = this.lib.user.uid();
		param.key = this.lib.user.key();
	}

	value = {
		module: module,
		call: call,
		data: param
	};

	// 多个参数对象型
	if ( typeof(value) == 'object' ) {
		for ( var k in value ) {
			if ( data ) {
				data += '&';
			}
			if ( typeof value[k] == 'object' ) {
				value[k] = JSON.stringify(value[k]);
			}
			data += k +'='+ value[k];
		}

	// 无效参数
	} else {
		return;
	}

	$.ajax({
		url: 'http://localhost:8081',
		data: data,
		success: function ( res ) {
			res = JSON.parse(res);
			if ( callback && res )
				callback(res);
		}
	});
}



