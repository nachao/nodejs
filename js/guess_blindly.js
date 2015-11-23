

function GuessBlindly ( account ) {

	this.comm = new Comm();
}


// 进入用户指定功能
GuessBlindly.prototype.opt = function ( value, userkey, callback ) {
	this.comm.use(function(data){
		if ( callback )
			callback(data);
	},{
		_: '001add',
		key: value,
		userkey: userkey
	});
}


// 进入用户指定功能
GuessBlindly.prototype.init = function ( el, userkey ) {
	var that = this;

	this.comm.use(function(data){
		var area = $('#guess_blindly');
		area.show().find('.temp').remove();

		$(data).each(function(i, val){
			var temp = $('#qb_template').clone();

			temp.html(val).attr('title', i).show().addClass('temp');
			temp.click(function(){
				that.opt(i, userkey, function(data){
					console.log(data);
					temp.html( parseInt(temp.html()) + 1 );
				});
			});
			area.append(temp);
		});
	}, {
		_:'001',
		userkey: userkey
	});
}

