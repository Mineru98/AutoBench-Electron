const axios = require("axios");
const request = require("request");
const cheerio = require("cheerio");


const getHtml = async (url) => {
  try {
    return await axios.get(url);
  } catch (error) {
    console.error(error);
  }
};

request.get({url: 'http://autobench-web.run.goorm.io/mainboard_db.html'}, (err, res, body) => {
	let ulList = [];
  const $ = cheerio.load(body);
	const $bodyList = $("div.col#table-wrapper").children("div.row").children("div.col");
	console.log($bodyList)
	$bodyList.each(function(i, elem) {
		let detail = $(this).find("li").text().split("\t").join("").split("\n\n").join("\n").split(":").join("\n").split("\n");
		
		detail = detail.filter(function (el) {
			if (el.length != 0)
				return el;
		});
		
		if (detail.length == 16) {
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
		} else if (detail.length == 17){
			ulList[i] = {
				id: i+1,
				name: $(this).find('h4').text(),
				socket: detail[1],
				form: detail[3].trim(),
				chipset: detail[5].trim(),
				support_ram: detail[7],
				usb2: detail[13],
				usb3: null,
				sata: detail[16]
			};
		} else if (detail.length == 18) {
			ulList[i] = {
				id: i+1,
				name: $(this).find('h4').text(),
				socket: detail[1],
				form: detail[3].trim(),
				chipset: detail[5].trim(),
				support_ram: detail[7],
				usb2: detail[13],
				usb3: detail[15],
				sata: detail[17]
			};
		}
	});
	const data = ulList.filter(n => n.name);
	
	data.forEach(element => {
    console.log(element);
  });
});

request.get({url: 'https://motherboarddb.com/motherboards/?page=3&so=y'}, (err, res, body) => {
	let ulList = [];
  const $ = cheerio.load(body);
	const $bodyList = $("div.col#table-wrapper")//.children("div.row").children("div.col");
	console.log(body)
	$bodyList.each(function(i, elem) {
		let detail = $(this).find("li").text().split("\t").join("").split("\n\n").join("\n").split(":").join("\n").split("\n");
		
		detail = detail.filter(function (el) {
			if (el.length != 0)
				return el;
		});
		
		if (detail.length == 16) {
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
		} else if (detail.length == 17){
			ulList[i] = {
				id: i+1,
				name: $(this).find('h4').text(),
				socket: detail[1],
				form: detail[3].trim(),
				chipset: detail[5].trim(),
				support_ram: detail[7],
				usb2: detail[13],
				usb3: null,
				sata: detail[16]
			};
		} else if (detail.length == 18) {
			ulList[i] = {
				id: i+1,
				name: $(this).find('h4').text(),
				socket: detail[1],
				form: detail[3].trim(),
				chipset: detail[5].trim(),
				support_ram: detail[7],
				usb2: detail[13],
				usb3: detail[15],
				sata: detail[17]
			};
		}
	});
	const data = ulList.filter(n => n.name);
	
	data.forEach(element => {
    console.log(element);
  });
});

// getHtml("https://www.cpubenchmark.net/high_end_cpus.html").then(html => {
//   let ulList = [];
//   const $ = cheerio.load(html.data);
//   const $bodyList = $("div#mark ul.chartlist").children("li");

//   $bodyList.each(function(i, elem) {
//     ulList[i] = {
//         rank: i+1,
//         name: $(this).find('span.prdname').text(),
//         score: Number($(this).find('span.count').text().replace(',',''))
//     };
//   });

//   const data = ulList.filter(n => n.name);
//   return data;
// }).then((res) => {
//   res.forEach(element => {
//     console.log(element);
//   });
// });
