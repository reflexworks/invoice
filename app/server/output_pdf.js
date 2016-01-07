module.exports = function () {

	  var querystring = ReflexContext.querystring();

	  // 各パラメータ取得
	  var querystrings = querystring.split('&');
	  var data_path = null;
	  var template_path = null;
	  var pdf_name = null;
	  var base_name = null;
	  var isFeed = false;
	  for (var i = 0, ii = querystrings.length; i < ii; ++i) {
		  var param = querystrings[i];
		  if (param.indexOf('data=') !== -1) {
			  data_path = param.replace('data=', '');
		  } else if (param.indexOf('template=') !== -1) {
			  template_path = param.replace('template=', '');
		  } else if (param.indexOf('name=') !== -1) {
			  pdf_name = param.replace('name=', '');
		  } else if (param.indexOf('base_name=') !== -1) {
			  base_name = param.replace('base_name=', '');
		  } else if (param === 'feed') {
			  isFeed = true;
		  }
	  }

	  // リソースデータ取得
	  var data = null;
	  if (isFeed) {
		  data = ReflexContext.getFeed(data_path);
	  } else {
		  data = ReflexContext.getEntry(data_path);
	  }

	  if (base_name) {
		  // PDF出力
		  ReflexContext.toPdf(data, template_path, pdf_name, base_name);
	  } else {
		  // PDF出力
		  ReflexContext.toPdf(data, template_path, pdf_name);
	  }

}