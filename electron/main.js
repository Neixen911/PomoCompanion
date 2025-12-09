const { app, BrowserWindow, ipcMain } = require('electron/main')
const fs = require('node:fs')
const path = require('node:path')

global.timerEnd = null;

const createWindow = () => {
	const win = new BrowserWindow({
		width: 600,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
		}
	})
	win.loadURL('http://localhost:5173')
}

app.whenReady().then(() => {
	ipcMain.on('startTimer', async (_event, minutes, secondes) => {
		console.log(`Launching timer ...`)
		global.timerEnd = Date.now() + (parseInt(minutes) * 60000) + (parseInt(secondes) * 1000);
		console.log(`Timer ends at ${new Date(global.timerEnd).getHours()}h${new Date(global.timerEnd).getMinutes()}m${new Date(global.timerEnd).getSeconds()}s`);
	});
	ipcMain.on('pauseTimer', async (_event) => {
		console.log('Pausing timer ...')
	});
	ipcMain.on('resetTimer', async (_event) => {
		console.log('Resetting timer ...')
	});
	createWindow()
})
