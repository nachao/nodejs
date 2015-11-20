

	function uxUser ( account ) {
	}


	// 获取用户信息，如果没有则会创建新用户并返回
	uxUser.prototype.get = function ( account, callback ) {
		$.ajax({
			url: 'http://localhost:8081',
			data: 'account=' + account,
			success: function ( data ) {
				if ( callback )
					callback(data);
			}
		});
	}