

	// 注册一个功能
	ux._006 = new Abc();


	// 定义功能样式
	ux._006.set({

		// 申明变量
		openEl: $('#ux006_Open'),
		closeEl: $('#ux006_Close'),
		contentEl: $('#ux006_Content'),

		// 初始化事件
		initEvent: function () {
			this.openEl.click(function(){
				contentEl.show();
			});
			this.closeEl.click(function(){
				contentEl.hide();
			});
		},

		// 打开界面
		openUI: function () {
			console.log(1);
		}

	});


	// 扩展外部方法
	// ux.


	// 调用
	// ux._006.open();


	console.log( ux._006.get('openUI', 'param')() );
