const fs = require('fs');
const axios = require("axios");
const cheerio = require("cheerio");
const whitelist = require('./whitelist.js');

// 0~ 1685
const list = whitelist.getlist(0,1685);

let result = [];

const getHtml = async (url, i) => {
  try {
    return await axios.get(url);
  } catch (error) {
		return "error";
  }
};

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
				_list.push(detail)
				
			});
		}).then(()=>{
			_list.push(i)
			resolve(_list);
		});
  });
};

async function makefile() {
	// 한번에 정상적으로 res 받을 수 있는 횟수는 50회
	// 9~14개의 플레그가 있다.
	// count 10 개일때 [9]은 제외
	// count 11 개일때 [10]은 제외
	// count 12 개일때 [7],[11]은 제외
	// count 13 개일때 [7],[11],[12]은 제외
	// count 14 개일때 [9],[10],[11],[12],[13]은 제외
	// count 15 개일때 [9],[10],[11],[12],[13],[14]은 제외
	for( var key in list ) {
		console.log(list[key] + " 크롤링 시작");
		await getData(list[key]).then(value => {
			let ulList = [];
			let onBoard = false;
			let chip = 0, form = 0, video, storage, usb2a = 0, usb3a = 0, usb3c = 0, usb3_1_2_a = 0, usb3_1_2_c = 0;// 체크포인트 지정
			let ide = 0, sata1 = 0, sata2 = 0, sata3 = 0, sataE = 0, sas = 0;
			let pci1_1_16 = 0, pci1_1_8 = 0, pci1_1_4 = 0, pci1_1_1 = 0, pci1_4_16 = 0, pci1_4_8 = 0, pci1_4_4 = 0, pci1_4_1 = 0, pci1_8_16 = 0, pci1_8_8 = 0, pci1_8_4 = 0, pci1_8_1 = 0, pci1_16_16 = 0, pci1_16_8 = 0, pci1_16_4 = 0, pci1_16_1 = 0;
			let pci2_1_16 = 0, pci2_1_8 = 0, pci2_1_4 = 0, pci2_1_1 = 0, pci2_4_16 = 0, pci2_4_8 = 0, pci2_4_4 = 0, pci2_4_1 = 0, pci2_8_16 = 0, pci2_8_8 = 0, pci2_8_4 = 0, pci2_8_1 = 0, pci2_16_16 = 0, pci2_16_8 = 0, pci2_16_4 = 0, pci2_16_1 = 0;
			let pci3_1_16 = 0, pci3_1_8 = 0, pci3_1_4 = 0, pci3_1_1 = 0, pci3_4_16 = 0, pci3_4_8 = 0, pci3_4_4 = 0, pci3_4_1 = 0, pci3_8_16 = 0, pci3_8_8 = 0, pci3_8_4 = 0, pci3_8_1 = 0, pci3_16_16 = 0, pci3_16_8 = 0, pci3_16_4 = 0, pci3_16_1 = 0;
			let pci4_1_16 = 0, pci4_1_8 = 0, pci4_1_4 = 0, pci4_1_1 = 0, pci4_4_16 = 0, pci4_4_8 = 0, pci4_4_4 = 0, pci4_4_1 = 0, pci4_8_16 = 0, pci4_8_8 = 0, pci4_8_4 = 0, pci4_8_1 = 0, pci4_16_16 = 0, pci4_16_8 = 0, pci4_16_4 = 0, pci4_16_1 = 0;
			let crossfire = false, sli = false;
			let mem_count = 0, mem_type = 0, mem_max_capacity = 0, mem_max_speed = 0;
			let m2_e = 0, m2_m = 0;

			value[1].forEach((element, index) =>{
				if (element == "Chipset")
					chip = index
				if (element == "Onboard CPU"){
					chip = index
					onBoard = true
				}
				if (element == "Form Factor")
					form = index
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
			});

			value[6].forEach((element, index)=>{
				if (element.indexOf("PCI-E 1.0 x1 @ x16") != -1) {
					pci1_1_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x1 @ x8") != -1) {
					pci1_1_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x1 @ x4") != -1) {
					pci1_1_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x1 @ x1") != -1) {
					pci1_1_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x4 @ x16") != -1) {
					pci1_4_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x4 @ x8") != -1) {
					pci1_4_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x4 @ x4") != -1) {
					pci1_4_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x4 @ x1") != -1) {
					pci1_4_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x8 @ x16") != -1) {
					pci1_8_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x8 @ x8") != -1) {
					pci1_8_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x8 @ x4") != -1) {
					pci1_8_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x8 @ x1") != -1) {
					pci1_8_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x16 @ x16") != -1) {
					pci1_16_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x16 @ x8") != -1) {
					pci1_16_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x16 @ x4") != -1) {
					pci1_16_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 1.0 x16 @ x1") != -1) {
					pci1_16_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}


				if (element.indexOf("PCI-E 2.0 x1 @ x16") != -1) {
					pci2_1_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x1 @ x8") != -1) {
					pci2_1_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x1 @ x4") != -1) {
					pci2_1_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x1 @ x1") != -1) {
					pci2_1_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x4 @ x16") != -1) {
					pci2_4_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x4 @ x8") != -1) {
					pci2_4_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x4 @ x4") != -1) {
					pci2_4_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x4 @ x1") != -1) {
					pci2_4_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x8 @ x16") != -1) {
					pci2_8_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x8 @ x8") != -1) {
					pci2_8_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x8 @ x4") != -1) {
					pci2_8_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x8 @ x1") != -1) {
					pci2_8_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x16 @ x16") != -1) {
					pci2_16_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x16 @ x8") != -1) {
					pci2_16_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x16 @ x4") != -1) {
					pci2_16_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 2.0 x16 @ x1") != -1) {
					pci2_16_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}


				if (element.indexOf("PCI-E 3.0 x1 @ x16") != -1) {
					pci3_1_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x1 @ x8") != -1) {
					pci3_1_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x1 @ x4") != -1) {
					pci3_1_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x1 @ x1") != -1) {
					pci3_1_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x4 @ x16") != -1) {
					pci3_4_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x4 @ x8") != -1) {
					pci3_4_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x4 @ x4") != -1) {
					pci3_4_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x4 @ x1") != -1) {
					pci3_4_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x8 @ x16") != -1) {
					pci3_8_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x8 @ x8") != -1) {
					pci3_8_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x8 @ x4") != -1) {
					pci3_8_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x8 @ x1") != -1) {
					pci3_8_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x16 @ x16") != -1) {
					pci3_16_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x16 @ x8") != -1) {
					pci3_16_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x16 @ x4") != -1) {
					pci3_16_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 3.0 x16 @ x1") != -1) {
					pci3_16_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				
				
				if (element.indexOf("PCI-E 4.0 x1 @ x16") != -1) {
					pci4_1_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x1 @ x8") != -1) {
					pci4_1_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x1 @ x4") != -1) {
					pci4_1_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x1 @ x1") != -1) {
					pci4_1_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x4 @ x16") != -1) {
					pci4_4_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x4 @ x8") != -1) {
					pci4_4_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x4 @ x4") != -1) {
					pci4_4_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x4 @ x1") != -1) {
					pci4_4_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x8 @ x16") != -1) {
					pci4_8_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x8 @ x8") != -1) {
					pci4_8_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x8 @ x4") != -1) {
					pci4_8_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x8 @ x1") != -1) {
					pci4_8_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x16 @ x16") != -1) {
					pci4_16_16 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x16 @ x8") != -1) {
					pci4_16_8 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x16 @ x4") != -1) {
					pci4_16_4 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}
				if (element.indexOf("PCI-E 4.0 x16 @ x1") != -1) {
					pci4_16_1 += parseInt(element.substring(0,2).replace(/[^0-9]/g,''))
				}

				if (element.indexOf("AMD Crossfire") != -1) {
					if(value[6][index+1] == "No") {
						crossfire = false
					}
					else if(value[6][index+1] == "Yes") {
						crossfire = true
					} 
				}

				if(element.indexOf("Nvidia SLI") != -1) {
					if(value[6][index+1] == "No") {
						sli = false
					}
					else if(value[6][index+1] == "Yes") {
						sli = true
					} 
				}
			});

			if (value.length > 11) {
				value[9].forEach((element, index)=>{
					if(value[9][0] == "M.2 Connections") {
						if (element.indexOf("M-Key") != -1) {
							m2_m += parseInt(value[9][index-1].replace(/[^0-9]/g,''))
						}
						if (element.indexOf("E-Key") != -1) {
							m2_e += parseInt(value[9][index-1].replace(/[^0-9]/g,''))
						}
					}
				});
			}

			if (value.length > 12){
				value[10].forEach((element, index)=>{
					if(value[10][0] == "M.2 Connections") {
						if (element.indexOf("M-Key") != -1) {
							m2_m += parseInt(value[10][index-1].replace(/[^0-9]/g,''))
						}
						if (element.indexOf("E-Key") != -1) {
							m2_e += parseInt(value[10][index-1].replace(/[^0-9]/g,''))
						}
					}
				});
			}
			
			if(value.length == 11) {

				mem_count = parseInt(value[8][0].replace(/[^0-9]/g,''))

				value[8].forEach((element, index) => {
					if (element.indexOf("Slot Protocol") != -1)
						mem_type = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
					if (element.indexOf("Maximum Speed") != -1)
						mem_max_speed = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
					if (element.indexOf("Maximum Capacity") != -1)
						mem_max_capacity = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
				})
				
				if (onBoard == true) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 0){
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][form+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 9) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if(chip == 10) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-2]+value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				}
			} else if (value.length == 12) {
				if (value[8][0] == 'Audiochip'){
					mem_count = parseInt(value[9][0].replace(/[^0-9]/g,''))

					value[9].forEach((element, index) => {
						if (element.indexOf("Slot Protocol") != -1)
							mem_type = parseInt(value[9][index+1].replace(/[^0-9]/g,''))
						if (element.indexOf("Maximum Speed") != -1)
							mem_max_speed = parseInt(value[9][index+1].replace(/[^0-9]/g,''))
						if (element.indexOf("Maximum Capacity") != -1)
							mem_max_capacity = parseInt(value[9][index+1].replace(/[^0-9]/g,''))
					})
				} else {
					mem_count = parseInt(value[8][0].replace(/[^0-9]/g,''))
					value[8].forEach((element, index) => {
						if (element.indexOf("Slot Protocol") != -1)
							mem_type = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
						if (element.indexOf("Maximum Speed") != -1)
							mem_max_speed = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
						if (element.indexOf("Maximum Capacity") != -1)
							mem_max_capacity = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
					})
				}

				if (onBoard == true) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 0){
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][form+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 9) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if(chip == 10) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-2]+value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				}
			} else if (value.length == 13) {
				if(value[9][0] == 'Reviewer'){
					mem_count = parseInt(value[8][0].replace(/[^0-9]/g,''))

					value[8].forEach((element, index) => {
						if (element.indexOf("Slot Protocol") != -1)
							mem_type = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
						if (element.indexOf("Maximum Speed") != -1)
							mem_max_speed = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
						if (element.indexOf("Maximum Capacity") != -1)
							mem_max_capacity = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
					})
				} else if (value[9][0] == 'M.2 Connections') {
					mem_count = parseInt(value[8][0].replace(/[^0-9]/g,''))

					value[8].forEach((element, index) => {
						if (element.indexOf("Slot Protocol") != -1)
							mem_type = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
						if (element.indexOf("Maximum Speed") != -1)
							mem_max_speed = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
						if (element.indexOf("Maximum Capacity") != -1)
							mem_max_capacity = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
					})
				} else {
					mem_count = parseInt(value[9][0].replace(/[^0-9]/g,''))

					value[9].forEach((element, index) => {
						if (element.indexOf("Slot Protocol") != -1)
							mem_type = parseInt(value[9][index+1].replace(/[^0-9]/g,''))
						if (element.indexOf("Maximum Speed") != -1)
							mem_max_speed = parseInt(value[9][index+1].replace(/[^0-9]/g,''))
						if (element.indexOf("Maximum Capacity") != -1)
							mem_max_capacity = parseInt(value[9][index+1].replace(/[^0-9]/g,''))
					})
				}
				
				if (onBoard == true) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 0){
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][form+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 9) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if(chip == 10) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-2]+value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				}
			} else if (value.length == 14) {
				mem_count = parseInt(value[9][0].replace(/[^0-9]/g,''))

				value[9].forEach((element, index) => {
					if (element.indexOf("Slot Protocol") != -1)
						mem_type = parseInt(value[9][index+1].replace(/[^0-9]/g,''))
					if (element.indexOf("Maximum Speed") != -1)
						mem_max_speed = parseInt(value[9][index+1].replace(/[^0-9]/g,''))
					if (element.indexOf("Maximum Capacity") != -1)
						mem_max_capacity = parseInt(value[9][index+1].replace(/[^0-9]/g,''))
				})
				
				if (onBoard == true) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 0){
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][form+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 9) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if(chip == 10) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-2]+value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				}
			} else if (value.length == 15) {
				mem_count = parseInt(value[8][0].replace(/[^0-9]/g,''))

				value[8].forEach((element, index) => {
					if (element.indexOf("Slot Protocol") != -1)
						mem_type = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
					if (element.indexOf("Maximum Speed") != -1)
						mem_max_speed = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
					if (element.indexOf("Maximum Capacity") != -1)
						mem_max_capacity = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
				})

				if (onBoard == true) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 0){
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][form+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 9) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if(chip == 10) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-2]+value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				}
			} else if (value.length == 16) {
				mem_count = parseInt(value[8][0].replace(/[^0-9]/g,''))

				value[8].forEach((element, index) => {
					if (element.indexOf("Slot Protocol") != -1)
						mem_type = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
					if (element.indexOf("Maximum Speed") != -1)
						mem_max_speed = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
					if (element.indexOf("Maximum Capacity") != -1)
						mem_max_capacity = parseInt(value[8][index+1].replace(/[^0-9]/g,''))
				})

				if (onBoard == true) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 0){
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][form+1],
						chipset: null,
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if (chip == 9) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				} else if(chip == 10) {
					ulList = {
						id: parseInt(value[value.length-1]),
						name: value[0],
						manufacturer: value[1][1],
						socket: value[1][5]+value[1][6],
						form: value[1][chip-2]+value[1][chip-1],
						chipset: value[1][chip+1],
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
						mem_count: mem_count,
						mem_type: mem_type,
						mem_max_speed: mem_max_speed,
						mem_max_capacity: mem_max_capacity,
						pci1_16_16: pci1_16_16,
						pci1_16_8: pci1_16_8,
						pci1_16_4: pci1_16_4,
						pci1_16_1: pci1_16_1,
						pci1_8_16: pci1_8_16,
						pci1_8_8: pci1_8_8,
						pci1_8_4: pci1_8_4,
						pci1_8_1: pci1_8_1,
						pci1_4_16: pci1_4_16,
						pci1_4_8: pci1_4_8,
						pci1_4_4: pci1_4_4,
						pci1_4_1: pci1_4_1,
						pci1_1_16: pci1_1_16,
						pci1_1_8: pci1_1_8,
						pci1_1_4: pci1_1_4,
						pci1_1_1: pci1_1_1,
						pci2_16_16: pci2_16_16,
						pci2_16_8: pci2_16_8,
						pci2_16_4: pci2_16_4,
						pci2_16_1: pci2_16_1,
						pci2_8_16: pci2_8_16,
						pci2_8_8: pci2_8_8,
						pci2_8_4: pci2_8_4,
						pci2_8_1: pci2_8_1,
						pci2_4_16: pci2_4_16,
						pci2_4_8: pci2_4_8,
						pci2_4_4: pci2_4_4,
						pci2_4_1: pci2_4_1,
						pci2_1_16: pci2_1_16,
						pci2_1_8: pci2_1_8,
						pci2_1_4: pci2_1_4,
						pci2_1_1: pci2_1_1,
						pci3_16_16: pci3_16_16,
						pci3_16_8: pci3_16_8,
						pci3_16_4: pci3_16_4,
						pci3_16_1: pci3_16_1,
						pci3_8_16: pci3_8_16,
						pci3_8_8: pci3_8_8,
						pci3_8_4: pci3_8_4,
						pci3_8_1: pci3_8_1,
						pci3_4_16: pci3_4_16,
						pci3_4_8: pci3_4_8,
						pci3_4_4: pci3_4_4,
						pci3_4_1: pci3_4_1,
						pci3_1_16: pci3_1_16,
						pci3_1_8: pci3_1_8,
						pci3_1_4: pci3_1_4,
						pci3_1_1: pci3_1_1,
						crossfire: crossfire,
						sli: sli,
						m2_m: m2_m,
						m2_e: m2_e
					};
				}
			}
			for(var key in ulList) {
				if ((ulList[key] == 0) && (typeof ulList[key] == "number")){
					delete ulList[key]
				}
			}
			result.push(ulList)
		});
	}
};

makefile().then(()=>{
	fs.writeFile('mainboard/mainboard_tmp.json', JSON.stringify(result), 'utf8', (err)=>{
		console.log("OK")
	});
});
