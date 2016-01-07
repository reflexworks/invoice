var _thisHref; // 現在のページハッシュ情報
var _navId = '#side_menu'; // ナビゲーションID
var _pageId = '#page'; // インクルード先表示ID
function initInclude() {

	// 初期読み込み
	if (!location.hash || location.hash === '#') {
		// デフォルトページ設定
//		location.hash = $(_navId).find('.active').find('a').attr('href');
	}
	
	// 初期イベント
	doInclude(location.hash);

	// hash変更時のイベント
	window.onhashchange = doInclude;

	// メニュークリック時のイベント
	$(_navId).find('li').find('a').click(function(){
		doInclude($(this).attr('href'));
	});

}

// インクルード実行処理
function doInclude(href) {

	var _location = location;
	var $nav = $(_navId).find('li');

	if (href && href.type) href = location.hash;

	if (href && href !== '#') {

		href = href.replace('#', '');
		if  (_thisHref !== href) {
			$(_pageId).load(href+'.html', function(responseText, textStatus, XMLHttpRequest) {
				  if (XMLHttpRequest.status === 403) {
					  _location.reload();
				  }
			});
			_thisHref = href;
			$nav.removeClass('active');
			$nav.find('[href="#' + href + '"]').parent().addClass('active');
		}
	} else {
		$(_pageId).load('top.html', function(responseText, textStatus, XMLHttpRequest) {
			  if (XMLHttpRequest.status === 403) {
				  _location.reload();
			  }
		});
		_thisHref = href;
		$nav.removeClass('active');
	}
}
