var _common = {};

// ログイン中かどうか判断する
_common.isLogin = function(moveLoginPageFlg) {
	
	var defer = $.Deferred();
	
	_common.getUid().then(function(){
		$('#login, #registration').hide();
		$('#logout, #user_top').show();
		defer.resolve(true);
	}, function(){
		if (moveLoginPageFlg) {
			location.href = 'login.html';
		}
		defer.resolve(false);
	})
	return defer.promise();
};

// ログアウト処理
_common.logout = function() {
	var defer = $.Deferred();
	$.restModule.get({
		url: '/d?_logout'
	}).then(function(){
		defer.resolve();
	}, function(jqXHR, textStatus, errorThrow){
		alert('ログアウトに失敗しました。(' + jqXHR.status + ')');
	});
	return defer.promise();
};

// ハッシュ化したパスワードを取得する
_common.getHashPass = function(pass){
	var shaObj = new jsSHA(pass, "ASCII");
	return shaObj.getHash("SHA-256", "B64");
};

// uidを取得する
_common.getUid = function(moveLoginPageFlg){
	var defer = $.Deferred();
	$.restModule.get({
		url: '/d/?_uid'
	}).then(function(res){
		if (res.feed) {
			defer.resolve(res.feed.title);
		} else {
			defer.reject(null);
		}
	}, function(jqXHR, textStatus, errorThrow){
		if (jqXHR.status === (401 || 403) && moveLoginPageFlg) {
			location.href = 'login.html';
		} else {
			defer.reject(jqXHR);
		}
	});
	return defer.promise();
};

//指定したアカウントのuidを取得する
_common.getUidFormAccountName = function(account_name){
	var defer = $.Deferred();
	$.restModule.get({
		url: '/d/?_uid=' + account_name
	}).then(function(res){
		if (res.feed && res.feed.title !== '-1') {
			defer.resolve(res.feed.title);
		} else {
			defer.reject(null);
		}
	}, function(jqXHR, textStatus, errorThrow){
		defer.reject(jqXHR);
	});
	return defer.promise();
};

_common.escapeHtml = function(content) {
	if (content && content !== '') {
		return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	} else {
		return content;
	}
};

_common.checkLoginPassword = function(pass) {
	if (pass.match('^(?=.*?[0-9])(?=.*?[a-zA-Z])(?=.*?[!-/@_])[A-Za-z!-9@_]{8,}$')) {
		return true;
	} else {
		return false;
	}
};

_common.priceSeparator = function(val){
	return '¥' + val.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,');
};

// 今日の日付を取得する
_common.getToday = function(){
	//今日の日付データを変数hidukeに格納
	var hiduke=new Date(); 

	//年・月・日・曜日を取得する
	var year = hiduke.getFullYear();
	var month = hiduke.getMonth()+1;
	var day = hiduke.getDate();

	if (String(month).length === 1) month = '0' + month;
	if (String(day).length === 1) day = '0' + day;

	return year + '/' + month + '/' + day;
};

_common.resizePreviewModal = function(event){
	var $target = $(event.data.target);
	var window_hei = $(window).height() - 15;
	var preview_modal = $target.outerHeight(true);
	var modal_header = $target.find('.modal-header').outerHeight(true);
	var modal_footer = $target.find('.modal-footer').outerHeight(true);
	$target.find('iframe').height(window_hei - (modal_header + modal_footer ));
};

_common.noticeCount = 0;
_common.noticeSuccess = function(mes){
	_common.noticeCount++;
	var isCount = _common.noticeCount;
	_common.isNotice = isCount;

	$('#noticeSuccess, #noticeError').hide();
	$('#noticeSuccess').show().find('#noticeSuccessMesseage').html(mes).end();
	setTimeout(function(){
		if (_common.isNotice === isCount) {
			$('#noticeSuccess').fadeOut("slow");
		}
	}, 7000);

};
_common.noticeError = function(mes){
	_common.noticeCount++;
	var isCount = _common.noticeCount;
	_common.isNotice = isCount;

	$('#noticeSuccess, #noticeError').hide();
	$('#noticeError').show().find('#noticeErrorMesseage').html(mes);
	setTimeout(function(){
		if (_common.isNotice === isCount) {
			$('#noticeError').fadeOut("slow");
		}
	}, 7000);

};

_common.viewTransactionData = function($target, data){
	var feed = data.feed;
	
};