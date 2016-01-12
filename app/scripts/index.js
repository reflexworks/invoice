var _uid;
var _$customer_input_target;
var _$load_template_target;
var _load_template_type;
var _datepicker_option = {
	format: "yyyy/mm/dd",
	language: 'ja',
	todayHighlight: true,
	todayBtn: "linked",
	autoclose: true
};

$(function(){

	_common.getUid(true).then(function(uid){
		_uid = uid;
		initInclude();
	});

	// テンプレート一覧から選択
	$('#template_road_modal_ok').click(function(){
		_$load_template_target;
		var type = _load_template_type;
		$('#template_road_modal').modal('hide');
		return false;
	});

	// 顧客一覧から選択
	$('#customer_list_modal_ok').click(function(){
		var val = $(this).html();
		_$customer_input_target.val(val);
		$('#customer_list_modal').modal('hide');
		return false;
	});

});