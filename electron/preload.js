const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('timer', {
	startTimer: (hours, minutes, pauseValue, eachTime) => ipcRenderer.send('startTimer', hours, minutes, pauseValue, eachTime),
	pauseTimer: () => ipcRenderer.send('pauseTimer'),
	resetTimer: () => ipcRenderer.send('resetTimer'),
	getTimeLeft: () => ipcRenderer.invoke('getTimeLeft'),
	getAllowedMinutesValues: () => ipcRenderer.invoke('getAllowedMinutesValues'),
	getAllowedHoursValues: () => ipcRenderer.invoke('getAllowedHoursValues'),
})