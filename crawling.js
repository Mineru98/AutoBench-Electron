const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

const getHtml = async (url, i) => {
  try {
    return await axios.get(url);
  } catch (error) {
		return "error";
  }
};

function cpudataget() {
	getHtml("https://www.cpubenchmark.net/high_end_cpus.html").then(html => {
		let ulList = [];
		const $ = cheerio.load(html.data);
		const $bodyList = $("div#mark ul.chartlist").children("li");

		$bodyList.each(function(i, elem) {
			ulList[i] = {
					rank: i+1,
					name: $(this).find('span.prdname').text(),
					score: Number($(this).find('span.count').text().replace(',',''))
			};
		});

		const data = ulList.filter(n => n.name);
		return data;
	}).then((res) => {
		res.forEach(element => {
			console.log(element);
		});
	});
}

function getData(i) {
  return new Promise(function (resolve, reject) {
		const url = `https://motherboarddb.com/motherboards/${i}`;
		let count = 0;
		getHtml(url, i).then(html => {
			if (html == "error"){
				resolve(`${i}, null\n`);
			}
			let ulList = [];
			const $ = cheerio.load(html.data);
			const $bodyList = $("div.card-body");
			const model_name = $("div.container").children("div.row").children("div.col").find("h1").text();
			
			$bodyList.each(function(j, elem) {
				let detail = $(this).text().split("\n\n\n").join("\n").split("\n\n").join("\n").replace("\n","").split("\n");
				detail = detail.filter(function (el) {
					if (el.length != 0)
						return el.trim();
				});
				count++;
				// console.log(i, detail)
				
				/*
				ulList[i] = {
					id: i+1,
					name: $(this).find('h4').text(),
					socket: detail[1],
					form: detail[3].trim(),
					chipset: detail[5].trim(),
					support_ram: detail[7],
					usb2: detail[13],
					usb3: null,
					sata: null
				};
				*/
			});
			// const data = ulList.filter(n => n.name);

			// data.forEach(element => {
			// 	console.log(element);
			// });
		}).then(()=>{
			resolve(`${i}, ${count}\n`);
		});
  });
}

// 한번에 정상적으로 res 받을 수 있는 횟수는 50회
// 9~14개의 플레그가 있다.
for(var i = 1; i <= 50; i++){
	getData(i).then(value => {
		fs.appendFile('data1.csv', value, function (err) {
			if (err) throw err;
		});
	});
}
