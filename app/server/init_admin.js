module.exports = function () {

	var uid = ReflexContext.uid();
	var initSelfList = [
	                    '/trans',
	                    '/qua',
	                    '/inv',
	                    '/record',
	                    '/preview',
	                    '/template',
	                    '/customer',
	                    '/mycompany'
	                    ];
	
	deleteList(uid, initSelfList);
	var res = postList(uid, initSelfList);
	setList(uid, initSelfList);
	ReflexContext.doResponse(res);

};

function deleteList(uid, initSelfList) {
	for (var i = 0, ii = initSelfList.length; i < ii; ++i) {
		ReflexContext.deleteFolder('/' + uid + initSelfList[i] + '?_rf');
	}
}

function postList(uid, initSelfList) {
	var data = { 'feed': { 'entry': getEntry(uid, initSelfList)}};
	return ReflexContext.post(data);
}

function getEntry(uid, initSelfList) {
	var entry = [];
	for (var i = 0, ii = initSelfList.length; i < ii; ++i) {
		entry.push(getSelfEntry(uid, initSelfList[i]));
	}
	return entry;
}

function getSelfEntry(uid, key) {
	return {
		'link': [{
			'___href': '/'+ uid + key,
			'___rel': 'self'
		}]
	};
}

function setList(uid, initSelfList){
	var cash = {};
	for (var i = 0, ii = initSelfList.length; i < ii; ++i) {
		var key = initSelfList[i].substring(1, 2).toUpperCase();
		if (cash[key]) {
			key = initSelfList[i].substring(1, 3).toUpperCase();
		}
		ReflexContext.rangeids('/' + uid + initSelfList[i], '0-9999999,' + key);
		cash[key] = true;
	}
}
