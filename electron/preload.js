const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('timer', {
	startTimer: (minutes, secondes) => ipcRenderer.send('startTimer', minutes, secondes),
	pauseTimer: () => ipcRenderer.send('pauseTimer'),
	resetTimer: () => ipcRenderer.send('resetTimer'),
})