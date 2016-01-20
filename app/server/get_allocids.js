module.exports = function () {

	var uid = ReflexContext.uid();
	var templateNo = ReflexContext.allocids('/'+ uid + '/template', 1);
	return templateNo;

};
