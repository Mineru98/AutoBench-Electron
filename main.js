import gethwinfo from './gethwinfo'

gethwinfo().then((data) => {
    let mb = Object.values(data)[0];
    let cpu = Object.values(data)[1];
    let gpu = Object.values(data)[2];
    let ram = Object.values(data)[3];
    let drive = Object.values(data)[4];
    
    console.log(mb)
    console.log(cpu)
    console.log(gpu)
    console.log(ram) // 슬롯 여러개 존재 가능
    console.log(drive) // 슬롯 여러개 존재 가능
}).catch(function (err) {
    console.error(err);
});