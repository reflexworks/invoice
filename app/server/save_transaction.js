module.exports = function () {

	var uid = ReflexContext.uid();
	var reqData = ReflexContext.getRequest();

	var postData = getPostData(reqData);
	var res = ReflexContext.post(postData);
	ReflexContext.doResponse(res);

};

function getPostData(reqData) {

	var uid = ReflexContext.uid();
	var feed = reqData.feed;
	var transNo = ReflexContext.allocids('/'+ uid + '/trans', 1);
	var array = [];

	// トランザクションデータ作成
	for (var i = 0, ii = feed.entry.length; i < ii; ++i) {
		var entry = feed.entry[i];
		if (i === 0) {
			if (!entry.transaction.number || entry.transaction.number === '') {
				entry.transaction.number = transNo;
			}
			entry.link = [{
				'___href': '/'+ uid + '/trans/' + transNo,
				'___rel': 'self'
			}];
			array[0] = entry;
		} else {
			var recordNo = ReflexContext.allocids('/'+ uid + '/record', 1);
			entry.link = [{
				'___href': '/'+ uid + '/trans/' + transNo + '/' + recordNo,
				'___rel': 'self'
			},{
				'___href': '/'+ uid + '/record/' + recordNo,
				'___rel': 'alternate'
			}];
			array[i+1] = entry;
		}
	}

	// 顧客マスタデータ作成
	var customer_name = feed.entry[0].customer.customer_name;
	var isCustomer = ReflexContext.count('/' + uid + '/customer?f&customer.customer_name=' + customer_name);
	if (customer_name && customer_name !== '' && isCustomer === 0) {
		var customerNo = ReflexContext.allocids('/'+ uid + '/customer', 1);
		var new_customer = {};
		new_customer.customer = {};
		new_customer.customer.customer_name = customer_name;
		new_customer.link = [{
			'___href': '/'+ uid + '/customer/' + customerNo,
			'___rel': 'self'
		}];
		array.push(new_customer);
	}
	
	return {'feed': {'entry': array}};

}