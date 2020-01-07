const fs = require('fs');
const axios = require("axios");
const cheerio = require("cheerio");
const whitelist = require('./whitelist.js');

const url = whitelist.getlist(0,1245);
let list = [];

const getHtml = async (url) => {
  try {
    return await axios.get(url);
  } catch (error) {
		return "error";
  }
};

async function makefile() {
	for(let i = 0; i < url.length; i++){
		await getData(url[i]).then((data)=>{
			console.log(url[i]+" OK")
		});
	}
}

async function getData(url) {
	return new Promise(function (resolve, reject) {
		getHtml(url).then(html => {
			let ulList = [];
			const $ = cheerio.load(html.data);
			const title = $("div.product-family-title-text").find("h1").text();
			const detail = $("div.blade-inside").children("ul.specs-list").children("li");
			let socket, size;
			detail.each(function(i, elem) {
				if($(this).find("span.value").attr('data-key') == "SocketsSupported") {
					socket = $(this).find("span.value").text().trim()
				}
				if($(this).find("span.value").attr('data-key') == "PackageSize") {
					size = $(this).find("span.value").text().trim()
				}
			});
			ulList = {
					name: title,
					socket: socket,
					size: size
				}
			list.push(ulList)
			resolve("")
		});	
	});
}

makefile().then(()=>{
	fs.writeFile('cpu_data.json', JSON.stringify(list), 'utf8', (err)=>{
		console.log("CPU OK")
	});
})