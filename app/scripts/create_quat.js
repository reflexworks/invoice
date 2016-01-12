var _salestax = 0.1;
$(function(){

	// カレンダー表示
	$('#date').datepicker(_datepicker_option).val(_common.getToday());
	
	// テンプレート読込表示
	$('[data-id="load_template"]').click(function(){
		_load_template_type = 'quat';
		_$load_template_target = $('#create_quat_form');
	});

	// 顧客一覧表示
	$('#customer_list_btn').click(function(){
		// 選択した顧客名を入力する箇所を指定
		_$customer_input_target = $('#customer_name');
	});

	// 消費税を加えるか加えないか
	$('#is_salestax').change(function(){
		
		var isFlg = $(this).prop('checked');
		var subtotal = $('#subtotal').html() ? parseInt($('#subtotal').attr('data-subtotal')) : 0;
		if (isFlg) {
			salestax = subtotal * _salestax;
			salestax = Math.floor(salestax);
		} else {
			salestax = 0;
		}
		$('#salestax').html(_common.priceSeparator(salestax));
		$('#total').html(_common.priceSeparator((subtotal + salestax)));
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
				var windowId = 'preview' + Math.random();
				window.open('', windowId);
				setTimeout(function(){
					window.open('/s/output_pdf?data=/' + _uid + '/preview&template=/pdf/invoice.html', windowId);
				}, 0);
			}, function(res){
				
			});
		});
	});

	// 見積書作成実行
	$('[data-id="create_quat"]').click(function(){
		var postData = getData();
		$.restModule.post({
			'url': '/d/' + _uid + '/trans',
			'data': postData
		}).then(function(res){
			
		}, function(res){
			
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
	
	var transaction = {};
	transaction.number = $('#number').val();
	transaction.date = $('#date').val();
	transaction.job = $('#job').val();
	transaction.subtotal = $('#subtotal').html();
	transaction.salestax = $('#salestax').html();
	transaction.total = $('#total').html();	
	obj.feed.entry[0].transaction = transaction;
	
	var customer = {};
	customer.customer_name = $('#customer_name').val();
	obj.feed.entry[0].customer = customer;

	obj.feed.entry[0].content = {'______text' : $('#content').val()};

	var $recodes = $('#recode_list').find('tbody').find('tr');
	var num = 1;
	for (var i = 0, ii = $recodes.length; i < ii; ++i) {
		var $recode = $recodes.eq(i);
		var recode = {};
		var quantity = $recode.find('[data-id="quantity"]').val();
		var unit_price = $recode.find('[data-id="unit_price"]').val();
		if (quantity && unit_price) {
			recode.seq = num;
			recode.name = $recode.find('[data-id="name"]').val();
			recode.description = $recode.find('[data-id="description"]').val();
			recode.quantity = quantity;
			recode.unit_price = unit_price;
			recode.line_total = $recode.find('[data-id="line_total"]').html();
			obj.feed.entry.push({'recode': recode});
			num++;
		}
	}
	
	return obj;
}