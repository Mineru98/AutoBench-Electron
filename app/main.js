const {app, BrowserWindow, protocol} = require('electron')
const path = require('path')

let mainWindow

function createWindow () {
	mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
		resizable: false,
    webPreferences: {
			nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    },
		icon: path.join(__dirname, 'assets/icon-128-nocolor.png'),
  })
	mainWindow.setMenuBarVisibility(false) // menuBar 숨기기
  mainWindow.loadFile('public/index.html')
	console.log("Test")
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', async () => {
    createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})