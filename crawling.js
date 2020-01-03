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
		let chip, video, storage, usb2a = 0, usb3a = 0, usb3c = 0, usb3_1_2_a = 0, usb3_1_2_c = 0;// 체크포인트 지정
		let ide = 0, sata1 = 0, sata2 = 0, sata3 = 0, sataE = 0, sas = 0;
		let pci_16 = 0, pci_4 = 0, pci_1 = 0, crossfire = false, sli = false;
		
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
			if (element.indexOf("USB 2.0 Type-A") != -1) {
				usb2a += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("USB 3.0 Type-A") != -1) {
				usb3a += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("USB 3.0 Type-C") != -1) {
				usb3c += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("USB 3.1 Gen-2 Type-A") != -1) {
				usb3_1_2_a += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("USB 3.1 Gen-2 Type-C") != -1) {
				usb3_1_2_c += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
		});
		
		value[3].forEach((element,index) =>{
			if (element.indexOf("IDE") != -1) {
				ide += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("SATA1") != -1) {
				sata1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("SATA2") != -1) {
				sata2 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("SATA3") != -1) {
				sata3 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("SATA Express") != -1) {
				sataE += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("Mini-SAS") != -1) {
				sas += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
		})
		
		value[6].forEach((element, index)=>{
			if (element.indexOf("@ x16") != -1) {
				pci_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("@ x14") != -1) {
				pci_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("1x @ x1") != -1) {
				pci_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
			}
			if (element.indexOf("AMD Crossfire") != -1) {
				if(value[index] = "No") crossfire = false
				else if(value[index] = "Yes") crossfire = true
			}
			if(element.indexOf("Nvidia SLI") != -1) {
				if(value[index] = "No") sli = false
				else if(value[index] = "Yes") sli = true
			}
		})
		
		console.log("Crossfire:" + crossfire)
		console.log("SLI:" + sli)

		
		if(value.length == 10) {
			// console.log(value.length, value[0])
			// console.log(value.length, value[1])
			// console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			console.log(value.length, value[6])
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
				};
			}
		} else if (value.length == 11) {
			// console.log(value.length, value[0])
			// console.log(value.length, value[1])
			// console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			console.log(value.length, value[6])
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
				};
			}
		} else if (value.length == 12) {
			// console.log(value.length, value[0])
			// console.log(value.length, value[1])
			// console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			console.log(value.length, value[6])
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
				};
			}
		} else if (value.length == 13) {
			// console.log(value.length, value[0])
			// console.log(value.leusb2: value[1)
			// console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			console.log(value.length, value[6])
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
				};
			}
		} else if (value.length == 14) {
			// console.log(value.length, value[0])
			// console.log(value.length, value[1])
			// console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			console.log(value.length, value[6])
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
				};
			}
		} else if (value.length == 15) {
			// console.log(value.length, value@ x16[0])
			// console.log(value.length, value[1])
			// console.log(value.length, value[2])
			// console.log(value.length, value[3])
			// console.log(value.length, value[4])
			// console.log(value.length, value[5])
			console.log(value.length, value[6])
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
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
					usb2a: usb2a,
					usb3a: usb3a,
					usb3c: usb3c,
					usb3_1_2_a: usb3_1_2_a,
					usb3_1_2_c: usb3_1_2_c,
					ide: ide,
					sata1: sata1,
					sata2: sata2,
					sata3: sata3,
					sata_express: sataE,
					sas: sas,
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