const fs = require('fs');
const cheerio = require("cheerio");
let list = [];
const url = ["10th Generation Intel Core i3 Processors Product Specifications", "10th Generation Intel Core i5 Processors Product Specifications", "10th Generation Intel Core i7 Processors Product Specifications", "4th Generation Intel Core i3 Processors Product Specifications", "4th Generation Intel Core i5 Processors Product Specifications", "4th Generation Intel Core i7 Processors Product Specifications", "5th Generation Intel Core M Processors Product Specifications", "5th Generation Intel Core i3 Processors Product Specifications", "5th Generation Intel Core i5 Processors Product Specifications", "5th Generation Intel Core i7 Processors Product Specifications", "6th Generation Intel Core i3 Processors Product Specifications", "6th Generation Intel Core i5 Processors Product Specifications", "6th Generation Intel Core i7 Processors Product Specifications", "6th Generation Intel Core m Processors Product Specifications", "7th Generation Intel Core i3 Processors Product Specifications", "7th Generation Intel Core i5 Processors Product Specifications", "7th Generation Intel Core i7 Processors Product Specifications", "7th Generation Intel Core m Processors Product Specifications", "8th Generation Intel Core i3 Processors Product Specifications", "8th Generation Intel Core i5 Processors Product Specifications", "8th Generation Intel Core i7 Processors Product Specifications", "8th Generation Intel Core i9 Processors Product Specifications", "8th Generation Intel Core m Processors Product Specifications", "9th Generation Intel Core i3 Processors Product Specifications", "9th Generation Intel Core i5 Processors Product Specifications", "9th Generation Intel Core i7 Processors Product Specifications", "9th Generation Intel Core i9 Processors Product Specifications", "Intel Core X-series Processors Product Specifications", "Intel Pentium Gold Processor Series Product Specifications", "Intel Pentium Processor 1000 Series Product Specifications", "Intel Pentium Processor 2000 Series Product Specifications", "Intel Pentium Processor 3000 Series Product Specifications", "Intel Pentium Processor 4000 Series Product Specifications", "Intel Pentium Processor D Series Product Specifications", "Intel Pentium Processor G Series Product Specifications", "Intel Pentium Processor J Series Product Specifications", "Intel Pentium Processor N Series Product Specifications", "Intel Pentium Silver Processor Series Product Specifications", "Legacy Intel Core Processors Product Specifications", "Legacy Intel Pentium Processor Product Specifications", "2nd Generation Intel Xeon Scalable Processors Product Specifications", "Intel Xeon D Processor Product Specifications", "Intel Xeon E Processor Product Specifications", "Intel Xeon Processor E3 Family Product Specifications", "Intel Xeon Processor E3 v2 Family Product Specifications", "Intel Xeon Processor E3 v3 Family Product Specifications", "Intel Xeon Processor E3 v4 Family Product Specifications", "Intel Xeon Processor E3 v5 Family Product Specifications", "Intel Xeon Processor E3 v6 Family Product Specifications", "Intel Xeon Processor E3 v5 Family Product Specifications", "Intel Xeon Processor E5 v2 Family Product Specifications", "Intel Xeon Processor E5 v3 Family Product Specifications", "Intel Xeon Processor E5 v4 Family Product Specifications", "Intel Xeon Processor E7 Family Product Specifications", "Intel Xeon Processor E7 v2 Family Product Specifications", "Intel Xeon Processor E7 v3 Family Product Specifications", "Intel Xeon Processor E7 v4 Family Product Specifications", "Intel Xeon Scalable Processors Product Specifications", "Intel Xeon W Processor Product Specifications", "Legacy Intel Xeon Processors Product Specifications"];

async function makefile() {
	for(let i = 0; i < url.length; i++){
		await getData(url[i]).then((data)=>{
			console.log(url[i]+" OK")
		});
	}
}

async function getData(url) {
	return new Promise(function (resolve, reject) {
		fs.readFile(url+'.html', 'utf8', function(err, data){
			const $ = cheerio.load(data);
			const $bodyList = $("td.ark-product-name");
			$bodyList.each(function(i, elem) {
				const result = "https://ark.intel.com/"+$(this).find('a').attr('href');
				list.push(result)
			});
			resolve("")
		});
	});
}

makefile().then(()=>{
	fs.writeFile('cpu.json', JSON.stringify(list), 'utf8', (err)=>{
		console.log("CPU OK")
	});
})
