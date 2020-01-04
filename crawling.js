const fs = require('fs');
const axios = require("axios");
const cheerio = require("cheerio");

const cpu_list = ["high_end_cpus", "mid_range_cpus", "midlow_range_cpus", "low_end_cpus"];
const gpu_list = ["high_end_gpus", "mid_range_gpus", "midlow_range_gpus", "low_end_gpus"];

const ram_intel_read_list = ["read_uncached_ddr4_intel", "read_uncached_ddr3_intel", "read_uncached_ddr2_all"];
const ram_amd_read_list = ["read_uncached_ddr4_amd", "read_uncached_ddr3_amd", "read_uncached_ddr2_all"];
const ram_intel_write_list = ["write_ddr4_intel", "write_ddr3_intel", "write_ddr2_all"];
const ram_amd_write_list = ["write_ddr4_amd", "write_ddr3_amd", "write_ddr2_all"];
const ram_intel_latency_list = ["latency_ddr4_intel", "latency_ddr3_intel", "latency_ddr2_all"];
const ram_amd_latency_list = ["latency_ddr4_amd", "latency_ddr3_amd", "latency_ddr2_all"];

const drive_list = ["high_end_drives", "mid_range_drives", "low_mid_range_drives", "low_end_drives"];

let c_list = [], g_list = [], r_list = [], d_list = [];
let c_count = 1,  g_count = 1,  r_count = 1,  d_count = 1;

const getHtml = async (url) => {
  try {
    return await axios.get(url);
  } catch (error) {
		return "error";
  }
};

async function getData(name, type) {
  return new Promise(function (resolve, reject) {
		let url;
		if (type == 0) {
			url = `https://www.cpubenchmark.net/${cpu_list[name]}.html`;
		} else if (type == 1) {
			url = `https://www.videocardbenchmark.net/${gpu_list[name]}.html`;
		} else if (type == 2) {
			url = `https://www.harddrivebenchmark.net/${drive_list[name]}.html`;
		} else if (type == 3) {
			// list 부분을 바꾸며 추출해야함.
			url = `https://www.memorybenchmark.net/${ram_amd_read_list[name]}.html`;
		}
		
		getHtml(url).then(html => {
			let ulList = [];
			const $ = cheerio.load(html.data);
			const $bodyList = $("div#mark ul.chartlist").children("li");

			$bodyList.each(function(i, elem) {
				if (type == 0) {
					ulList[i] = {
						rank: c_count,
						name: $(this).find('span.prdname').text(),
						score: Number($(this).find('span.count').text().replace(',',''))
					};
					c_count++
				} else if (type == 1) {
					ulList[i] = {
						rank: g_count,
						name: $(this).find('span.prdname').text(),
						score: Number($(this).find('span.count').text().replace(',',''))
					};
					g_count++
				} else if (type == 2) {
					ulList[i] = {
						rank: d_count,
						name: $(this).find('span.prdname').text(),
						score: Number($(this).find('span.count').text().replace(',',''))
					};
					d_count++
				} else if (type == 3) {
					ulList[i] = {
						rank: r_count,
						name: $(this).find('span.prdname').text(),
						score: parseInt($(this).find('span.count').text().replace(',','').replace(/[^0-9]/g,''))
					};
					r_count++
				}
			});

			const data = ulList.filter(n => n.name);
			if (type == 0) {
				c_list.push(data);
			} else if (type == 1) {
				g_list.push(data);
			} else if (type == 2) {
				d_list.push(data);
			} else if (type == 3) {
				r_list.push(data);
			}
			
		}).then(() => {
			resolve();
		});
  });
};

async function c_makefile() {
	for(let i = 0; i < 4; i++){
		await getData(i, 0).then(()=>{
			console.log("OK")
		});
	}
}

async function g_makefile() {
	for(let i = 0; i < 4; i++){
		await getData(i, 1).then(()=>{
			console.log("OK")
		});
	}
}

async function d_makefile() {
	for(let i = 0; i < 4; i++){
		await getData(i, 2).then(()=>{
			console.log("OK")
		});
	}
}

async function r_makefile() {
	for(let i = 0; i < 3; i++){
		await getData(i, 3).then(()=>{
			console.log("OK")
		});
	}
}

c_makefile().then(()=>{
	fs.writeFile('database/cpu.json', JSON.stringify(c_list), 'utf8', (err)=>{
		console.log("CPU OK")
	});
});

g_makefile().then(()=>{
	fs.writeFile('database/gpu.json', JSON.stringify(g_list), 'utf8', (err)=>{
		console.log("GPU OK")
	});
});

d_makefile().then(()=>{
	fs.writeFile('database/drive.json', JSON.stringify(d_list), 'utf8', (err)=>{
		console.log("Drive OK")
	});
});

// r_makefile().then(()=>{
// 	fs.writeFile('database/ram_read_amd.json', JSON.stringify(r_list), 'utf8', (err)=>{
// 		console.log("RAM OK")
// 	});
// });