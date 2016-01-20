var _salestax = 0.1;
$(function(){

	// カレンダー表示
	$('#date').datepicker(_datepicker_option).val(_common.getToday());
	
	// テンプレート読込表示
	$('[data-id="load_template"]').click(function(){
		_load_template_type = 'quat';
		_$load_template_target = $('#create_quat_form');
		getTemplateList();
	});

	// テンプレート保存表示
	$('[data-id="save_template"]').click(function(){
		_save_template_type = 'quat';
		_save_template_data = getTemplateData();
		viewTemplateData();
	});

	// 顧客一覧表示
	$('#customer_list_btn').click(function(){
		// 選択した顧客名を入力する箇所を指定
		_$customer_input_target = $('#customer_name');
	});

	// 自社情報を表示する
	setMyCompany();

	// 自社情報編集
	$('#show_my_company_input_area').click(function(){
		$('[data-id="my_company_input_area"]').show();
		$('#display_my_company_area').hide();
	});
	$('#hide_my_company_input_area').click(function(){
		$('[data-id="my_company_input_area"]').hide();
		$('#display_my_company_area').show();
	});

	// 消費税を加えるか加えないか
	$('#is_salestax').change(function(){
		
		var isFlg = $(this).prop('checked');
		var subtotal = $('#subtotal').html() ? parseInt($('#subtotal').attr('data-subtotal')) : 0;
		if (isFlg && subtotal) {
			salestax = subtotal * _salestax;
			salestax = Math.floor(salestax);
		} else {
			salestax = 0;
		}
		$('#salestax').html(_common.priceSeparator(salestax));
		if (subtotal) {
			$('#total').html(_common.priceSeparator((subtotal + salestax)));
		}
	});

	// 初期設定で明細を5行追加
	addRecode(5);
	// 明細を1行追加
	$('#add_recode').click(function(){
		addRecode(1);
	});

	// プレビュー実行
	$('[data-id="preview"]').click(function(){
		var postData = getData();
		$.restModule.delete({
			'url': '/d/' + _uid + '/preview?f'
		}).then(function(res){
			$.restModule.post({
				'url': '/d/' + _uid + '/preview',
				'data': postData
			}).then(function(res){
				$('#preview_modal').modal('show').find('iframe').attr('src', '/s/output_pdf?data=/' + _uid + '/preview&template=/pdf/invoice.html');
			}, function(res){
				
			});
		});
	});
	
	// プレビュー画面リサイズ処理
	$(window).on('resize', {target: '#preview_modal'}, _common.resizePreviewModal).resize();

	// 見積書作成実行
	$('[data-id="create_quat"]').click(function(){
		var postData = getData();
		$.restModule.post({
			'url': '/s/save_transaction',
			'data': postData
		}).then(function(res){
			_common.noticeSuccess('見積書保存完了');
		}, function(res){
			_common.noticeError('見積書保存失敗');
		});
	});

});

// 明細を一行追加する
function addRecode(int){
	var temp = function(){
		return '' + 
		'<tr>' +
			'<td class="name"><input type="text" class="form-control" data-id="name" /></td>' +
			'<td class="description"><input type="text" class="form-control" data-id="description" /></td>' +
			'<td class="quantity"><input type="text" class="form-control" data-id="quantity" value="1" /></td>' +
			'<td class="unit_price"><input type="text" class="form-control" data-id="unit_price" /></td>' +
			'<td class="disp line_total"><span data-id="line_total">0</span></td>' +
			'<td><button class="btn" data-id="delete">削除</button></td>' +
		'</tr>';
	};
	var array = [];
	for (var i = 0, ii = int; i < ii; ++i) {
		array.push(temp());
	}
	$('#recode_list').find('tbody').append(array.join(''))
		.find('input[type="text"]').off('change').change(function(){
			var $this = $(this);
			var $tr = $this.parent().parent();
			if ($this.attr('data-id') === 'quantity') {
				changeLineTotal($tr, $this.val(), null);
			}
			if ($this.attr('data-id') === 'unit_price') {
				changeLineTotal($tr, null, $this.val());
			}
		}).end()
		.find('[data-id="delete"]').off('click').click(function(){
			var $this = $(this);
			var $tr = $this.parent().parent();
			var index = $('#recode_list').find('tbody').find('tr').index($tr);
			$tr.remove();
			changeTotal();
			return false;
		}).end();
}

// 単価の金額を計算する
function changeLineTotal($tr, quantity, unit_price) {

	if (!quantity) quantity = $tr.find('[data-id="quantity"]').val();
	if (!unit_price) unit_price = $tr.find('[data-id="unit_price"]').val();
	quantity = quantity ? parseInt(quantity) : 0;
	unit_price = unit_price ? parseInt(unit_price) : 0;
	$tr.find('[data-id="line_total"]').html(_common.priceSeparator((unit_price * quantity))).attr('data-price', (unit_price * quantity));

	changeTotal();

}

// 明細一覧から総金額を計算する
function changeTotal() {
	var $line_total_list = $('#recode_list').find('tbody').find('[data-id="line_total"]');
	var isSalestax = $('#is_salestax').prop('checked');
	var subtotal = 0;
	for (var i = 0, ii = $line_total_list.length; i < ii; ++i) {
		var line_total = $line_total_list.eq(i).attr('data-price');
		if (line_total && line_total !== '') {
			subtotal = subtotal + parseInt(line_total);
		}
	}
	var salestax = (isSalestax ? Math.floor(subtotal * _salestax) : 0);
	$('#subtotal').html(_common.priceSeparator(subtotal)).attr('data-subtotal', subtotal);
	$('#salestax').html(_common.priceSeparator(salestax));
	$('#total').html(_common.priceSeparator((subtotal + salestax)));
}

function getData(){
	var obj = {};
	obj.feed = {}
	obj.feed.entry = [];
	obj.feed.entry[0] = {}
	
	obj.feed.entry[0].transaction = getTransactionData();
	obj.feed.entry[0].customer = getCustomerData();
	obj.feed.entry[0].my_company = getMyCompanyData();
	obj.feed.entry[0].content = getContentData();
	obj.feed.entry[0].subtitle = getIsSalestax();

	var $recodes = $('#recode_list').find('tbody').find('tr');
	var num = 1;
	for (var i = 0, ii = $recodes.length; i < ii; ++i) {
		var $recode = $recodes.eq(i);
		var recode = {};
		var quantity = $recode.find('[data-id="quantity"]').val();
		var unit_price = $recode.find('[data-id="unit_price"]').val();
		if (quantity && unit_price) {
			var recodeData = getRecodeData($recode);
			recodeData.recode.seq = num;
			obj.feed.entry.push(recode);
			num++;
		}
	}
	
	return obj;
}

function getTemplateData(){
	var obj = {};
	obj.feed = {}
	obj.feed.entry = [];
	obj.feed.entry[0] = {}
	
	obj.feed.entry[0].transaction = getTransactionData();
	obj.feed.entry[0].customer = getCustomerData();
	obj.feed.entry[0].my_company = getMyCompanyData();
	obj.feed.entry[0].content = getContentData();
	obj.feed.entry[0].subtitle = getIsSalestax();

	var $recodes = $('#recode_list').find('tbody').find('tr');
	for (var i = 0, ii = $recodes.length; i < ii; ++i) {
		var $recode = $recodes.eq(i);
		obj.feed.entry.push(getRecodeData($recode));
	}
	
	return obj;
}

function getTransactionData(){
	var transaction = {};
	transaction.number = $('#number').val();
	transaction.date = $('#date').val();
	transaction.job = $('#job').val();
	transaction.subtotal = $('#subtotal').html();
	transaction.salestax = _salestax;
	transaction.total = $('#total').html();
	return transaction;
}
function getCustomerData(){
	var customer = {};
	customer.customer_name = $('#customer_name').val();
	return customer;
}
function getMyCompanyData(){
	var my_company = {};
	my_company.my_name = $('#my_name').val();
	my_company.my_zip = $('#my_zip').val();
	my_company.my_address = $('#my_address').val();
	my_company.my_telephone = $('#my_telephone').val();
	return my_company;
}
function getContentData(){
	return {'______text' : $('#content').val()};
}
function getRecodeData($recode){
	var recode = {};
	var quantity = $recode.find('[data-id="quantity"]').val();
	var unit_price = $recode.find('[data-id="unit_price"]').val();
	recode.name = $recode.find('[data-id="name"]').val();
	recode.description = $recode.find('[data-id="description"]').val();
	recode.quantity = $recode.find('[data-id="quantity"]').val();
	recode.unit_price = $recode.find('[data-id="unit_price"]').val();
	recode.line_total = $recode.find('[data-id="line_total"]').html();
	return {'recode': recode};
}

function setMyCompany(){
	$.restModule.get({
		'url': '/d/'+ _uid +'/mycompany?f&title=default'
	}).then(function(res){
		var entry = res.feed.entry[0];
		var my_name = entry.my_company.my_name;
		var my_zip = entry.my_company.my_zip;
		var my_address = entry.my_company.my_address;
		var my_telephone = entry.my_company.my_telephone;
		var array = ['', ' 〒', '', ' ', '', ' Tel: ', ''];
		array[0] = my_name;
		array[2] = my_zip;
		array[4] = my_address;
		array[6] = my_telephone;
		$('#display_my_company').val(array.join(''));
		$('#my_name').val(my_name).change(function(){
			array[0] = $(this).val();
			$('#display_my_company').val(array.join(''));
		});
		$('#my_zip').val(my_zip).change(function(){
			array[2] = $(this).val();
			$('#display_my_company').val(array.join(''));
		});;
		$('#my_address').val(my_address).change(function(){
			array[4] = $(this).val();
			$('#display_my_company').val(array.join(''));
		});;
		$('#my_telephone').val(my_telephone).change(function(){
			array[6] = $(this).val();
			$('#display_my_company').val(array.join(''));
		});;
	}, function(res){
		_common.noticeError('自社情報取得失敗');
	});
}

function getIsSalestax(){
	return $('#is_salestax').prop('checked') === true ? '税込':'税抜';
}