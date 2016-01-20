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
	var templateNo = ReflexContext.allocids('/'+ uid + '/template', 1);

	for (var i = 0, ii = feed.entry.length; i < ii; ++i) {
		if (i === 0) {
			feed.entry[i].link = [{
				'___href': '/'+ uid + '/template/' + templateNo,
				'___rel': 'self'
			}];
		} else {
			feed.entry[i].link = [{
				'___href': '/'+ uid + '/template/' + templateNo + '/' + templateNo + i,
				'___rel': 'self'
			}];
		}
	}

	return {'feed': feed};

}