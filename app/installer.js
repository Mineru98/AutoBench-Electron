var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './dist/AutoBench-win32-x64',
    outputDirectory: './dist/installer-win32-x64',
    exe: 'AutoBench.exe',
    setupExe: 'AutoBenchSetup.exe'
});

resultPromise.then(function () {
    console.log("It worked!");
}, function (e) {
    console.log('No dice: ' + e.message);
});