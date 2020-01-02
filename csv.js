const csvFilePath = './data_sort.csv';

const csv = require('csvtojson');

csv().fromFile(csvFilePath).then((jsonObj)=>{
	for( var key in jsonObj ) {
		console.log(Object.values(jsonObj[key]))
    // console.log(Object.values(jsonObj[0]));
	}
})