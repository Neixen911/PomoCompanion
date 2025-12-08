const { app, BrowserWindow, ipcMain } = require('electron/main')
const fs = require('node:fs')
const path = require('node:path')

const createWindow = () => {
	const win = new BrowserWindow({
		width: 600,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})
	win.loadFile('index.html')
}
app.whenReady().then(() => {
	ipcMain.on('startTimer', async (_event, minutes, secondes) => {
		console.log(`Launching timer for ${minutes} minutes and ${secondes} secondes ...`)
	});
	ipcMain.on('pauseTimer', async (_event) => {
		console.log('Pausing timer ...')
	});
	ipcMain.on('resetTimer', async (_event) => {
		console.log('Resetting timer ...')
	});
	createWindow()
})
