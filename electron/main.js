const { app, BrowserWindow, ipcMain } = require('electron/main')
const fs = require('node:fs')
const path = require('node:path')

global.hours = 0;
global.minutes = 0;
global.remaining = 0;
global.remainingBeforePause = 0;

global.endDate = null;
global.timerInterval = null;
global.pauseTime = null;
global.pauseEnd = null;

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
}

const initTimer = (hours, minutes) => {
	let endDate = new Date(Date.now());
	global.hours = hours;
	global.minutes = minutes;
	endDate.setHours(endDate.getHours() + global.hours);
	endDate.setMinutes(endDate.getMinutes() + global.minutes);
	setTimerEnd(endDate, (hours * 60 * 60 + minutes * 60));
	console.log(`Initialising timer for ${hours} hours and ${minutes} minutes`);
}

const initPause = (pauseTimeValue, eachTimeValue) => {
	let now = new Date(Date.now());
	let pauseTime = new Date(now.getTime() + 30 * 1000); // 30 sec for testing
	let pauseEnd = new Date(pauseTime.getTime() + 5 * 1000); // 5 sec for testing
	if (pauseTime <= global.endDate && pauseEnd <= global.endDate) {
		global.pauseTime = pauseTime;
		global.pauseEnd = pauseEnd;
		console.log(`Pause scheduled at ${global.pauseTime} until ${global.pauseEnd}`);
	} else {
		global.pauseTime = null;
		global.pauseEnd = null;
		console.log(`No more pause scheduled before the end`);
	}
}

const resumedTimer = () => {
	let endDate = new Date(Date.now());
	endDate.setTime(endDate.getTime() + global.remaining * 1000);
	setTimerEnd(endDate, global.remaining);
	console.log(`Resuming timer with ${global.remaining} sec remaining`);
	startingTimer();
}

const startingTimer = () => {
	console.log(`Starting / Restarting timer ...`);
	global.timerInterval = setInterval(() => {
		const now = new Date(Date.now());
		global.remaining = (global.endDate.getTime() - now.getTime()) / 1000;
		// console.log(`Time left: ${global.remaining} sec`);
		if (global.pauseTime !== null) {
			if (now >= global.pauseTime && !global.isInPause) {
				console.log(`Starting pause time at ${global.pauseTime}`);
				global.isInPause = true;
			}
			if (global.isInPause) {
				if (now >= global.pauseEnd) {
					console.log(`Ending pause time at ${global.pauseEnd}`);
					initPause();
					global.isInPause = false;
				}
			}
		}
		if (global.remaining <= 0) {
			clearInterval(global.timerInterval);
			global.timerInterval = null;
			global.endDate = null;
			global.remaining = 0;
			console.log(`Timer end at ${now}`);
		}
	}, INTERVAL_TICK);
}

const pauseTimer = () => {
	clearInterval(global.timerInterval);
	global.timerInterval = null;
	console.log(`Timer paused with ${global.remaining} sec remaining`);
}

const resetTimer = () => {
	clearInterval(global.timerInterval);
	global.timerInterval = null;
	global.endDate = null;
	global.remaining = 0;
	global.hours = 0;
	global.minutes = 0;
	console.log(`Timer entirely reset`);
}

app.whenReady().then(() => {
	ipcMain.on('startTimer', async (_event, hours, minutes) => {
		if (global.paused === true) {
			resumedTimer();
			global.paused = false;
		} else {
			if (global.endDate === null) {
				initTimer(hours, minutes);
				initPause();
			}
			startingTimer();
		}
	});

	ipcMain.on('pauseTimer', async (_event) => {
		if (global.timerInterval !== null) {
			pauseTimer();
			global.paused = true;
		}
	});

	ipcMain.on('resetTimer', async (_event) => {
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
