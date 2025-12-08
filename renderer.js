const startTimer = document.getElementById('start-timer')
startTimer.addEventListener('click', () => {
	const minutes = document.getElementById('minutes').value
	const secondes = document.getElementById('secondes').value
	window.versions.startTimer(minutes, secondes)
})

const pauseButton = document.getElementById('pause-timer')
pauseButton.addEventListener('click', () => {
	window.versions.pauseTimer()
})

const resetTimer = document.getElementById('reset-timer')
resetTimer.addEventListener('click', () => {
	window.versions.resetTimer()
})
