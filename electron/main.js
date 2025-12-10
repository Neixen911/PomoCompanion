const { app, BrowserWindow, ipcMain } = require('electron/main')
const fs = require('node:fs')
const path = require('node:path')

global.minutes = 0;
global.secondes = 0;

global.endDate = null;
global.remainingMs = 0;
global.timerInterval = null;

const INTERVAL_TICK = 100;

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

const setTimerEnd = (endDate, remaining) => {
	global.endDate = endDate;
	global.remainingMs = remaining;
	console.log(`Timer will end at ${global.endDate}`);
	console.log(`Remaining ms set to ${global.remainingMs}`);
}

const playTimer = (minutes, secondes) => {
	if (global.endDate === null) {
		let endDate = new Date();
		global.minutes = minutes;
		global.secondes = secondes;
		endDate.setMinutes(endDate.getMinutes() + global.minutes);
		endDate.setSeconds(endDate.getSeconds() + global.secondes);
		setTimerEnd(endDate, (minutes * 60 + secondes) * 1000);
	} else if (global.timerInterval === null) {
		let endDate = new Date();
		endDate.setTime(endDate.getTime() + global.remainingMs);
		setTimerEnd(endDate, global.remainingMs);
		console.log(`Resuming timer with ${global.remainingMs} ms remaining`);
	}
	if (global.timerInterval === null) {
		global.timerInterval = setInterval(() => {
			const now = new Date();
			global.remainingMs = global.endDate.getTime() - now.getTime();
			console.log(`Time left: ${global.remainingMs} ms`);
			if (global.remainingMs <= 0) {
				clearInterval(global.timerInterval);
				global.timerInterval = null;
				global.endDate = null;
				global.remainingMs = 0;
				console.log(`Timer end at ${now}`);
			}
		}, INTERVAL_TICK);
	}
}

const pauseTimer = () => {
	if (global.timerInterval !== null) {
		clearInterval(global.timerInterval);
		global.timerInterval = null;
		console.log(`Timer paused with ${global.remainingMs} ms remaining`);
	}
}

const resetTimer = () => {
	if (global.timerInterval !== null) {
		clearInterval(global.timerInterval);
		global.timerInterval = null;
		global.endDate = null;
		global.remainingMs = 0;
		console.log(`Timer reset`);
	}
}

app.whenReady().then(() => {
	ipcMain.on('startTimer', async (_event, minutes, secondes) => {
		console.log(`Launching timer ...`)
		playTimer(minutes, secondes);
	});
	ipcMain.on('pauseTimer', async (_event) => {
		console.log('Pausing timer ...')
		pauseTimer();
	});
	ipcMain.on('resetTimer', async (_event) => {
		console.log('Resetting timer ...')
		resetTimer();
	});
	ipcMain.handle('getTimeLeft', async () => {
		let minutes = global.minutes;
		let secondes = global.secondes;
		let remaining = global.remainingMs;
		let total = (minutes * 60 + secondes) * 1000;
		let endingPourcent = 100 - ((total - remaining) * 100 / total);
		return { minutes, secondes, remaining, endingPourcent };
	});

	createWindow()
})
