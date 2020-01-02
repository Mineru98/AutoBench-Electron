const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

const list = [29, 6, 82, 668, 1240, 1209]; // 9, 10, 11, 12, 13, 14

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
		let _list = [];
		getHtml(url, i).then(html => {
			if (html == "error"){
				resolve(`${i}, null\n`);
			}
			const $ = cheerio.load(html.data);
			const $bodyList = $("div.card-body");
			const model_name = $("div.container").children("div.row").children("div.col").find("h1").text();
			_list.push(model_name);
			$bodyList.each(function(j, elem) {
				let detail = $(this).text().split("\n\n\n").join("\n").split("\n\n").join("\n").replace("\n","").split("\n");
				detail = detail.filter(function (el) {
					if (el.length != 0)
						return el.trim();
				});
				count++;
				// console.log(i, detail)
				_list.push(detail)
				
			});
			// const data = ulList.filter(n => n.name);

			// data.forEach(element => {
			// 	console.log(element);
			// });
		}).then(()=>{
			resolve(_list);
			// resolve(`${i}, ${count}\n`);
		});
  });
}

// 한번에 정상적으로 res 받을 수 있는 횟수는 50회
// 9~14개의 플레그가 있다.
// count 10 개일때 [9]은 제외
// count 11 개일때 [10]은 제외
// count 12 개일때 [7],[11]은 제외
// count 13 개일때 [7],[11],[12]은 제외
// count 14 개일때 [9],[10],[11],[12],[13]은 제외
// count 15 개일때 [9],[10],[11],[12],[13],[14]은 제외
for( var key in list ) {
	getData(list[key]).then(value => {
		let ulList = [];
		let chip, video, storage, usb; // 체크포인트 지정
		
		value[1].forEach((element, index) =>{
			if (element == "Chipset")
				chip = index
		});
		value[2].forEach((element, index) =>{
			if (element == "Video")
				video = index
		});
		value[2].forEach((element, index) =>{
			if (element == "Storage")
				storage = index
		});
		value[2].forEach((element, index) =>{
			if (element == "USB")
				usb = index
		});
		
		if(value.length == 10) {
			// console.log(value.length, value[0])
			// console.log(value.length, value[1])
			console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			// console.log(value.length, value[6])
			// console.log(value.length, value[7])
			// console.log(value.length, value[8])
			if (chip == 9) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[7],
					usb2: value[13],
					usb3: null,
					sata: null
				};
			} else if(chip == 10) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-2]+value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[2][1],
					usb2: value[2][1],
					usb3: null,
					sata: null
				};
			}
		} else if (value.length == 11) {
			// console.log(value.length, value[0])
			// console.log(value.length, value[1])
			console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			// console.log(value.length, value[6])
			// console.log(value.length, value[7])
			// console.log(value.length, value[8])
			// console.log(value.length, value[9])
			if (chip == 9) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[7],
					usb2: value[13],
					usb3: null,
					sata: null
				};
			} else if(chip == 10) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-2]+value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[2][1],
					usb2: value[2][1],
					usb3: null,
					sata: null
				};
			}
		} else if (value.length == 12) {
			// console.log(value.length, value[0])
			// console.log(value.length, value[1])
			console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			// console.log(value.length, value[6])
			// console.log(value.length, value[8])
			// console.log(value.length, value[9])
			// console.log(value.length, value[10])
			if (chip == 9) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[7],
					usb2: value[13],
					usb3: null,
					sata: null
				};
			} else if(chip == 10) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-2]+value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[2][1],
					usb2: value[2][1],
					usb3: null,
					sata: null
				};
			}
		} else if (value.length == 13) {
			// console.log(value.length, value[0])
			// console.log(value.length, value[1])
			console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			// console.log(value.length, value[6])
			// console.log(value.length, value[8])
			// console.log(value.length, value[9])
			// console.log(value.length, value[10])
			if (chip == 9) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[7],
					usb2: value[13],
					usb3: null,
					sata: null
				};
			} else if(chip == 10) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-2]+value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[2][1],
					usb2: value[2][1],
					usb3: null,
					sata: null
				};
			}
		} else if (value.length == 14) {
			// console.log(value.length, value[0])
			// console.log(value.length, value[1])
			console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			// console.log(value.length, value[6])
			// console.log(value.length, value[7])
			// console.log(value.length, value[8])
			if (chip == 9) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[7],
					usb2: value[13],
					usb3: null,
					sata: null
				};
			} else if(chip == 10) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-2]+value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[2][1],
					usb2: value[2][1],
					usb3: null,
					sata: null
				};
			}
		} else if (value.length == 15) {
			// console.log(value.length, value[0])
			// console.log(value.length, value[1])
			console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			// console.log(value.length, value[6])
			// console.log(value.length, value[7])
			// console.log(value.length, value[8])
			if (chip == 9) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[7],
					usb2: value[13],
					usb3: null,
					sata: null
				};
			} else if(chip == 10) {
				ulList = {
					id: list[key],
					name: value[0],
					manufacturer: value[1][1],
					socket: value[1][5]+value[1][6],
					form: value[1][chip-2]+value[1][chip-1],
					chipset: value[1][chip+1],
					support_ram: value[2][1],
					usb2: value[2][1],
					usb3: null,
					sata: null
				};
			}
		}
	});
}
/*
for(var i = 1; i <= 50; i++){
	getData(i).then(value => {
		fs.appendFile('data1.csv', value, function (err) {
			if (err) throw err;
		});
	});
}
*/