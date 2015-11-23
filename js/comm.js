

function Comm ( account ) {

	this.param = {};
}


// 获取用户信息，如果没有则会创建新用户并返回
Comm.prototype.use = function ( callback, value ) {
	var data = '$=' + new Date().getTime();

	console.log(user.userinfo.key);

	// 两个参数型
	if ( typeof(value) == 'string' && user.userinfo.key ) {
		data += '&_='+ value +'&userkey='+ user.userinfo.key;

	// 多个参数对象型
	} else if ( typeof(value) == 'object' ) {
		if ( !value.userkey ) {
			value.userkey = user.userinfo.key;		
		}
		for ( var k in value ) {
			data += '&'+ k +'='+ value[k];
		}

	// 无效参数
	} else {
		return;
	}

	// console.log(value, data);

	$.ajax({
		url: 'http://localhost:8081',
		data: data,
		success: function ( res ) {
			res = JSON.parse(res);
			if ( callback )
				callback(res.data, res);
		}
	});
}


// 进入用户指定功能
Comm.prototype.getFunction = function ( key, callback ) {
	this.use(function(data){
		if ( callback )
			callback(data);
	}, key);
}




