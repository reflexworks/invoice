module.exports = function () {

	var uid = ReflexContext.uid();
	var data = {
		'feed': {
			'entry':
				[{
					'link': [{
						'___href': '/'+ uid +'/trans',
						'___rel': 'self'
					}]
				},{
					'link': [{
						'___href': '/'+ uid +'/record',
						'___rel': 'self'
					}]
				},{
					'link': [{
						'___href': '/'+ uid +'/preview',
						'___rel': 'self'
					}]
				}]
			}
		};
	ReflexContext.post(data);

	ReflexContext.log("adduser:"+uid);

};
