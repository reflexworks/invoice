(function($){

	var _doInit = function(){
		_setLoader();
	};
	var _doFinal = function(){
		_deleteLoader();
	};
	var _setLoader = function(){
		var marginTop = $(window).height() / 2;
		var Loadercss = 'width: 300px; margin: 0px auto; margin-top:'+ marginTop +';';
		var backCss = 'display: block; z-index: 9999999999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; height: 115%; width: 100%; will-change: opacity;';
		var textCss =  backCss + Loadercss +' text-align: center; padding-top: 10px;';
		var temp = '<div id="restModuleLoader" style="'+ backCss +'">'+
						'<div style="'+ Loadercss +'"></div>'+
					'</div>';
		var text = '<div id="restModuleLoaderText" style="'+ textCss +'"><div></div></div>';
		$('body').append('<div id="restModuleLoaderBack" style="background: #000; opacity: 0.1; '+ backCss +'"></div>' + temp + text);
	};
	var _deleteLoader = function(){
		$('#restModuleLoader, #restModuleLoaderText, #restModuleLoaderBack').remove();
	};
	var _getModule = function (opt){

		var defer = $.Deferred();

		_doInit();

		$.ajax({
			type: 'get',
			url: opt.url,
			success: function(data, status, xhr){
				defer.resolve(data, status, xhr);
			},
			error: function(jqXHR, textStatus, errorThrow){
				if (jqXHR.status === (401 || 403)) {
					location.href = 'login.html';
				} else {
					defer.reject(jqXHR, textStatus, errorThrow);
				}
			},
			complete: function(){
				_doFinal();
			}
		});
		return defer.promise();
	};
	var _postModule = function(opt){
		var defer = $.Deferred();

		_doInit();

		$.ajax({
			type: 'post',
			url: opt.url,
			dataType: 'json',
			data: JSON.stringify(opt.data),
			success: function(data, status, xhr){
				defer.resolve(data, status, xhr);
			},
			error: function(jqXHR, textStatus, errorThrow){
				if (jqXHR.status === (401 || 403)) {
					location.href = 'login.html';
				} else {
					defer.reject(jqXHR, textStatus, errorThrow);
				}
			},
			complete: function(){
				_doFinal();
			}
		});
		return defer.promise();
	};
	var _putModule = function(opt){
		var defer = $.Deferred();

		_doInit();

		$.ajax({
			type: 'put',
			url: opt.url,
			dataType: 'json',
			data: JSON.stringify(opt.data),
			success: function(data, status, xhr){
				defer.resolve(data, status, xhr);
			},
			error: function(jqXHR, textStatus, errorThrow){
				if (jqXHR.status === (401 || 403)) {
					location.href = 'login.html';
				} else {
					defer.reject(jqXHR, textStatus, errorThrow);
				}
			},
			complete: function(){
				_doFinal();
			}
		});
		return defer.promise();
	};
	var _deleteModule = function(opt){
		var defer = $.Deferred();

		_doInit();

		$.ajax({
			type: 'delete',
			url: opt.url,
			success: function(data, status, xhr){
				defer.resolve(data, status, xhr);
			},
			error: function(jqXHR, textStatus, errorThrow){
				if (jqXHR.status === (401 || 403)) {
					location.href = 'login.html';
				} else {
					defer.reject(jqXHR, textStatus, errorThrow);
				}
			},
			complete: function(){
				_doFinal();
			}
		});
		return defer.promise();
	};
	var _uploadModule = function(opt){
		
	};
	var _downloadModule = function(opt){
		
	};
	$.restModule = {
		'get': _getModule,
		'post': _postModule,
		'put': _putModule,
		'delete': _deleteModule,
		'upload': _uploadModule,
		'download': _downloadModule
	}
})(jQuery);
