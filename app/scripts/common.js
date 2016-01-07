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
		} else {
			$('#login, #registration').show();
			$('#logout, #user_top').hide();
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
		if (jqXHR.status === 401 && moveLoginPageFlg) {
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