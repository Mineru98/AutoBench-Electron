var fs = require('fs');
const csvFilePath = './data_sort_only_id.csv';

let list = [];

exports.getlist = function (start=0, end=1686) {
	var array = fs.readFileSync(csvFilePath).toString().split("\n");
		for(i in array) {
			list.push(array[i])
	}
  return list.slice(start, end);
};
