

function Comm ( account ) {

}


// 获取用户信息，如果没有则会创建新用户并返回
Comm.prototype.use = function ( callback, value ) {
	var data = '';

	// 多个参数对象型
	if ( typeof(value) == 'object' ) {
		for ( var k in value ) {
			if ( data ) {
				data += '&';
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
			console.log(res);
			res = JSON.parse(res);
			if ( callback )
				callback(res.data, res);
		}
	});
}



