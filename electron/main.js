const { app, BrowserWindow, ipcMain } = require('electron/main')
const fs = require('node:fs')
const path = require('node:path')

global.hours = 0;
global.minutes = 0;
global.remaining = 0;

global.endDate = null;
global.timerInterval = null;

global.nextPause = null;
global.phasePause = 0;

const INTERVAL_TICK = 100;
const allowedMinutesValues = [0, 1, 15, 30, 45, 60];
const allowedHoursValues = [0, 1, 2, 3, 4, 5, 6];

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
	global.remaining = remaining;
	console.log(`Timer will end at ${global.endDate}`);
	console.log(`Set to ${global.remaining} sec remaining`);
}

const playTimer = (hours, minutes) => {
	if (global.endDate === null) {
		let endDate = new Date(Date.now());
		global.hours = hours;
		global.minutes = minutes;
		endDate.setHours(endDate.getHours() + global.hours);
		endDate.setMinutes(endDate.getMinutes() + global.minutes);
		setTimerEnd(endDate, (hours * 60 * 60 + minutes * 60));
	} else if (global.timerInterval === null) {
		let endDate = new Date(Date.now());
		endDate.setTime(endDate.getTime() + global.remaining * 1000);
		setTimerEnd(endDate, global.remaining);
		console.log(`Resuming timer with ${global.remaining} sec remaining`);
	}

	if (global.timerInterval === null) {
		global.timerInterval = setInterval(() => {
			const now = new Date(Date.now());
			global.remaining = (global.endDate.getTime() - now.getTime()) / 1000;
			// console.log(`Time left: ${global.remaining} sec`);
			if (global.remaining <= 0) {
				clearInterval(global.timerInterval);
				global.timerInterval = null;
				global.endDate = null;
				global.remaining = 0;
				console.log(`Timer end at ${now}`);
			}
		}, INTERVAL_TICK);
	}
}

const pauseTimer = () => {
	if (global.timerInterval !== null) {
		clearInterval(global.timerInterval);
		global.timerInterval = null;
		console.log(`Timer paused with ${global.remaining} sec remaining`);
	}
}

const resetTimer = () => {
	clearInterval(global.timerInterval);
	global.timerInterval = null;
	global.endDate = null;
	global.remaining = 0;
	global.hours = 0;
	global.minutes = 0;
	console.log(`Timer reset`);
}

app.whenReady().then(() => {
	ipcMain.on('startTimer', async (_event, hours, minutes) => {
		console.log(`Launching timer ...`)
		playTimer(hours, minutes);
	});
	ipcMain.on('pauseTimer', async (_event) => {
		console.log('Pausing timer ...')
		pauseTimer();
	});
	ipcMain.on('resetTimer', async (_event) => {
		console.log('Resetting timer ...')
		resetTimer();
	});
	ipcMain.handle('getAllowedMinutesValues', async () => {
		return allowedMinutesValues;
	});
	ipcMain.handle('getAllowedHoursValues', async () => {
		return allowedHoursValues;
	});
	ipcMain.handle('getTimeLeft', async () => {
		let hours = global.hours;
		let minutes = global.minutes;
		let remaining = global.remaining;
		let total = hours * 60 * 60 + minutes * 60;
		let endingPourcent = 100 - ((total - remaining) * 100 / total);
		// console.log(`Getting time left: ${hours} hours, ${minutes} minutes, ${remaining} sec remaining, ${endingPourcent}% left`);
		return { hours, minutes, remaining, endingPourcent };
	});

	createWindow()
})
