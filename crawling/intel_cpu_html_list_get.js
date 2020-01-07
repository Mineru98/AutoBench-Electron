const fs = require('fs');
const cheerio = require("cheerio");
let list = [];
const url = ["10th Generation Intel Core i3 Processors Product Specifications.html", "10th Generation Intel Core i5 Processors Product Specifications.html", "10th Generation Intel Core i7 Processors Product Specifications.html", "4th Generation Intel Core i3 Processors Product Specifications.html", "4th Generation Intel Core i5 Processors Product Specifications.html", "4th Generation Intel Core i7 Processors Product Specifications.html", "5th Generation Intel Core M Processors Product Specifications.html", "5th Generation Intel Core i3 Processors Product Specifications.html", "5th Generation Intel Core i5 Processors Product Specifications.html", "5th Generation Intel Core i7 Processors Product Specifications.html", "6th Generation Intel Core i3 Processors Product Specifications.html", "6th Generation Intel Core i5 Processors Product Specifications.html", "6th Generation Intel Core i7 Processors Product Specifications.html", "6th Generation Intel Core m Processors Product Specifications.html", "7th Generation Intel Core i3 Processors Product Specifications.html", "7th Generation Intel Core i5 Processors Product Specifications.html", "7th Generation Intel Core i7 Processors Product Specifications.html", "7th Generation Intel Core m Processors Product Specifications.html", "8th Generation Intel Core i3 Processors Product Specifications.html", "8th Generation Intel Core i5 Processors Product Specifications.html", "8th Generation Intel Core i7 Processors Product Specifications.html", "8th Generation Intel Core i9 Processors Product Specifications.html", "8th Generation Intel Core m Processors Product Specifications.html", "9th Generation Intel Core i3 Processors Product Specifications.html", "9th Generation Intel Core i5 Processors Product Specifications.html", "9th Generation Intel Core i7 Processors Product Specifications.html", "9th Generation Intel Core i9 Processors Product Specifications.html", "Intel Core X-series Processors Product Specifications.html", "Intel Pentium Gold Processor Series Product Specifications.html", "Intel Pentium Processor 1000 Series Product Specifications.html", "Intel Pentium Processor 2000 Series Product Specifications.html", "Intel Pentium Processor 3000 Series Product Specifications.html", "Intel Pentium Processor 4000 Series Product Specifications.html", "Intel Pentium Processor D Series Product Specifications.html", "Intel Pentium Processor G Series Product Specifications.html", "Intel Pentium Processor J Series Product Specifications.html", "Intel Pentium Processor N Series Product Specifications.html", "Intel Pentium Silver Processor Series Product Specifications.html", "Legacy Intel Core Processors Product Specifications.html", "Legacy Intel Pentium Processor Product Specifications.html"];

async function makefile() {
	for(let i = 0; i < url.length; i++){
		await getData(url[i]).then((data)=>{
			console.log(url[i]+" OK")
		});
	}
}

async function getData(url) {
	return new Promise(function (resolve, reject) {
		fs.readFile(url, 'utf8', function(err, data){
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
