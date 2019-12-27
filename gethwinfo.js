import wmic from 'ms-wmic'

export default function gethwinfo() {
    return new Promise((resolve, reject) => {
        wmic.execute('MEMORYCHIP get PartNumber', (err, stdOut) => {
            if (err) reject(new Error("error case #mem"));
            let mem = (stdOut);
            for (var i = 0; i < 12; i++)
                mem = mem.replace(/\r\r/,'\n');
            mem = mem.split("\n");
            
            wmic.execute('CPU get Name', (err, stdOut) => {
                if (err) reject(new Error("error case #cpu"));
                let cpu = (stdOut).replace('(R)','').replace('(TM)','').replace('CPU ','');
                
                wmic.execute('BASEBOARD get Product', (err, stdOut) => {
                    if (err) reject(new Error("error case #motherboard"));
                    let board = (stdOut).replace('\r','');

                    wmic.execute('DISKDRIVE get Model', (err, stdOut) => {
                        if (err) reject(new Error("error case #diskdrive"));
                        let drive = (stdOut)
                        for (var i = 0; i < 10; i++)
                            drive = drive.replace(/\r\r/,'\n');
                        drive = drive.split("\n");

                        wmic.execute('path win32_VideoController get name', (err, stdOut) => {
                            if (err) reject(new Error("error case #gpu"));
                            let gpu = (stdOut).replace('NVIDIA ','').replace('AMD ', '');

                            resolve({ 'MainBoard': board, 'CPU': cpu , 'GPU' : gpu, 'RAM' : mem, 'Drive' : drive});
                        });
                    });
                });
            });
        });
    });
}
