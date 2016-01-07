var _salestax = 0.1;
$(function(){

	// 消費税を加えるか加えないか
	$('#is_salestax').change(function(){
		
		var isFlg = $(this).prop('checked');
		var subtotal = $('#subtotal').html() ? parseInt($('#subtotal').html()) : 0;
		if (isFlg) {
			salestax = subtotal * _salestax;
			salestax = Math.floor(salestax);
		} else {
			salestax = 0;
		}
		$('#salestax').html(salestax);
		$('#total').html(subtotal + salestax);
	});

	// 明細を一行追加
	$('#add_recode').click(function(){
		addRecode();
	}).click();

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
function addRecode(){
	var temp = function(){
		return '' + 
		'<tr>' +
			'<td><input type="text" class="form-control" data-id="name" /></td>' +
			'<td><input type="text" class="form-control" data-id="description" /></td>' +
			'<td><input type="text" class="form-control" data-id="quantity" value="1" /></td>' +
			'<td><input type="text" class="form-control" data-id="unit_price" /></td>' +
			'<td class="disp"><span data-id="line_total">0</span></td>' +
			'<td><button class="btn" data-id="delete">削除</button></td>' +
		'</tr>';
	};
	$('#recode_list').find('tbody').append(temp())
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
	$tr.find('[data-id="line_total"]').html((unit_price * quantity));

	changeTotal();

}

// 明細一覧から総金額を計算する
function changeTotal() {
	var $line_total_list = $('#recode_list').find('tbody').find('[data-id="line_total"]');
	var isSalestax = $('#is_salestax').prop('checked');
	var subtotal = 0;
	for (var i = 0, ii = $line_total_list.length; i < ii; ++i) {
		var line_total = $line_total_list.eq(i).html();
		if (line_total && line_total !== '') {
			subtotal = subtotal + parseInt(line_total);
		}
	}
	var salestax = subtotal * _salestax;
	$('#subtotal').html(subtotal);
	$('#salestax').html((isSalestax ? Math.floor(salestax) : 0));
	$('#total').html(subtotal + parseInt($('#salestax').html()));
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
	for (var i = 0, ii = $recodes.length; i < ii; ++i) {
		var $recode = $recodes.eq(i);
		var recode = {};
		recode.seq = i + 1;
		recode.name = $recode.find('[data-id="name"]').val();
		recode.description = $recode.find('[data-id="description"]').val();
		recode.quantity = $recode.find('[data-id="quantity"]').val();
		recode.unit_price = $recode.find('[data-id="unit_price"]').val();
		recode.line_total = $recode.find('[data-id="line_total"]').html();
		obj.feed.entry.push({'recode': recode});
	}
	
	return obj;
}