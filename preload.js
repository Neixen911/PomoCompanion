const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
	node: () => process.versions.node,
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
	startTimer: (minutes, secondes) => ipcRenderer.send('startTimer', minutes, secondes),
	pauseTimer: () => ipcRenderer.send('pauseTimer'),
	resetTimer: () => ipcRenderer.send('resetTimer'),
})