var _uid;
var _$customer_input_target;
var _$load_template_target;
var _load_template_type;
var _save_template_type;
var _save_template_data;
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
		
		postMyCompany();
		
	});

	actionTemplateSaveModal();
	actionTemplateRoadModal();
	actionCustomerListModal();

});

function postMyCompany(){

	var my_company_data;

	$.restModule.get({
		'url': '/d/'+ _uid +'/mycompany?e'
	}).then(function(res){
		my_company_data = res;
		if (res.feed.entry[0].title !== 'accessed') {
			$('#init_my_company_modal').modal('show');
		}
	}, function(res){
		_common.noticeError('自社情報初期チェック失敗');
	});

	var putMyCompanyAccessed = function(){
		my_company_data.feed.entry[0].title = 'accessed';
		
		$.restModule.put({
			'url': '/d/',
			'data': my_company_data
		}).then(function(res){
			$('#init_my_company_modal').modal('hide');
		}, function(res){
			_common.noticeError('自社情報 accessed失敗');
		});
	};
	// 自社情報初期登録処理
	$('#init_my_company_modal_ok').click(function(){
		
		var postData = {'feed': {'entry': [{
			'title': 'default',
			'my_company': {
				'my_name': $('#init_my_name').val(),
				'my_zip': $('#init_my_zip').val(),
				'my_address': $('#init_my_address').val(),
				'my_telephone': $('#init_my_telephone').val(),
			}
		}]}};
		$.restModule.post({
			'url': '/d/' + _uid + '/mycompany',
			'data': postData
		}).then(function(res){
			putMyCompanyAccessed();
		}, function(res){
			_common.noticeError('自社情報初期登録失敗');
		});
	});

	// 自社情報初期登録スキップ
	$('#init_my_company_modal_skip').click(function(){		
		putMyCompanyAccessed();
	});

}

// テンプレート保存機能
function actionTemplateSaveModal(){

	// テンプレート保存から選択
	$('#template_save_modal_ok').click(function(){
		var type = _save_template_type;
		var title = $('#template_save_input').val();
		if (title && title !== '') {
			var postData = _save_template_data;
			postData.feed.entry[0].template = {};
			postData.feed.entry[0].template.template_name = title;
			postData.feed.entry[0].template.template_type = type;
			postData.feed.entry[0].template.master_my_company = $('#template_save_is_my_company_master').prop('checked');
			postData.feed.entry[0].template.master_tax_rate = $('#template_save_is_salestax_master').prop('checked');
			postData.feed.entry[0].template.template_recode_size = postData.feed.entry.length - 1;
			$.restModule.post({
				'url': '/s/save_template',
				'data': postData
			}).then(function(res){
				$('#template_save_modal').modal('hide');
				_common.noticeSuccess('テンプレート保存完了');
			}, function(res){
				_common.noticeError('テンプレート保存失敗');
			});
		}
		return false;
	});

	$('#template_save_is_my_company_master').change(function(){
		var is = $(this).prop('checked');
		if (is) {
			$('#template_save_my_company_area').find('.form_content_value').addClass('none');
		} else {
			$('#template_save_my_company_area').find('.form_content_value').removeClass('none');
		}
	});
	
	$('#show_template_save_my_company_area').click(function(){
		$(this).hide();
		$('#hide_template_save_my_company_area').show();
		$('#template_save_my_company_area').show();
	});

	$('#show_template_save_my_company_area').click(function(){
		$(this).hide();
		$('#hide_template_save_my_company_area').show();
		$('#template_save_my_company_area').show();
	});

	$('#hide_template_save_my_company_area').click(function(){
		$(this).hide();
		$('#show_template_save_my_company_area').show();
		$('#template_save_my_company_area').hide();
	});

	$('#show_template_save_recode_list_area').click(function(){
		$(this).hide();
		$('#hide_template_save_recode_list_area').show();
		$('#template_save_recode_list_area').show();
	});

	$('#hide_template_save_recode_list_area').click(function(){
		$(this).hide();
		$('#show_template_save_recode_list_area').show();
		$('#template_save_recode_list_area').hide();
	});
	
	$('#template_save_is_salestax_master').change(function(){
		var is = $(this).prop('checked');
		if (is) {
			$('#template_save_salestax_percent').addClass('none');
		} else {
			$('#template_save_salestax_percent').removeClass('none');
		}
	});
	
}

function viewTemplateData(){
	var data = _save_template_data.feed.entry;
	var transaction = data[0].transaction;
	$('#template_save_number').html(transaction.number ? transaction.number : '<span>{入力なし}</span>');
	$('#template_save_date').html(transaction.date ? transaction.date : '<span>{入力なし}</span>');
	$('#template_save_job').html(transaction.job ? transaction.job : '<span>{入力なし}</span>');
	
	var isSalestax = transaction.is_tax;
	$('#template_save_is_salestax').html(isSalestax);

	var master = data[0].master;
	$('#template_save_salestax_percent').html((master.tax_rate * 100)+'%');

	var customer_name = data[0].customer.customer_name;
	$('#template_save_customer_name').html(customer_name ? customer_name : '<span>{入力なし}</span>');

	var my_company = data[0].my_company;
	$('#template_save_my_name').html(my_company.my_name ? my_company.my_name : '<span>{入力なし}</span>');
	$('#template_save_my_zip').html(my_company.my_zip ? my_company.my_zip : '<span>{入力なし}</span>');
	$('#template_save_my_address').html(my_company.my_address ? my_company.my_address : '<span>{入力なし}</span>');
	$('#template_save_my_telephone').html(my_company.my_telephone ? my_company.my_telephone : '<span>{入力なし}</span>');

	var content = data[0].content.______text;
	$('#template_save_content').html(content ? content : '<span>{入力なし}</span>');
	
	$('#template_save_recode_list_length').html((data.length - 1) + '件');

	var array = [];
	for (var i = 1, ii = data.length; i < ii; ++i) {
		var recode = data[i].recode;
		var recode_name = recode.name ? '<div>' + recode.name + '</div>' : '<span class="text">{入力なし}</span>';
		var description = recode.description ? '<div>' + recode.description + '</div>' : '<span class="text">{入力なし}</span>';
		var quantity = recode.quantity ? '<div>' + recode.quantity + '</div>' : '<span class="text">{入力なし}</span>';
		var unit_price = recode.unit_price ? '<div>' + recode.unit_price + '</div>' : '<span class="text">{入力なし}</span>';
		array.push('<tr class="overflow_hidden"><td>'+ recode_name +'</td><td>'+ description +'</td><td>'+ quantity +'</td><td>'+ unit_price +'</td></tr>');
	}
	$('#template_save_recode_list').find('tbody').html(array.join(''));
}

// テンプレート一覧機能
function actionTemplateRoadModal(){
	// テンプレート一覧から選択
	$('#template_road_modal_ok').click(function(){
		_$load_template_target;
		var type = _load_template_type;
		$('#template_road_modal').modal('hide');
		return false;
	});
}

function getTemplateList(){
	var type = _load_template_type;
	$.restModule.get({
		'url': '/d/' + _uid + '/template?f&template.template_type=' + type
	}).then(function(res){
		if (res) {
			setTemplateList(res);
		}
	}, function(res){
		_common.noticeError('テンプレート一覧取得失敗');
	});
}

function setTemplateList(res){
	var $target = _$load_template_target;
	var entry = res.feed.entry;
	var array = [];
	for (var i = 0, ii = entry.length; i < ii; ++i) {
		var template_name = entry[i].template.template_name ? entry[i].template.template_name : '<span class="text">{入力なし}</span>';
		var customer_name = entry[i].customer.customer_name ? entry[i].customer.customer_name : '<span class="text">{入力なし}</span>';
		var recode_size = entry[i].template.template_recode_size ? entry[i].template.template_recode_size : 0;
		array.push('<tr><td>'+ template_name +'</td><td>'+ customer_name +'</td><td>'+ recode_size +'件</td><td><button class="btn">詳細</button></td></tr>');
	}
	$('#template_road_list').find('tbody').html(array.join(''));
}

// 顧客一覧機能
function actionCustomerListModal(){
	// 顧客一覧から選択
	$('#customer_list_modal_ok').click(function(){
		var val = $(this).html();
		_$customer_input_target.val(val);
		$('#customer_list_modal').modal('hide');
		return false;
	});
}

