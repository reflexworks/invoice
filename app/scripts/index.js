var _uid;
$(function(){

	_common.getUid(true).then(function(uid){
		_uid = uid;
		initInclude();
	});

});