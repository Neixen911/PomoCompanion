<script>
	const INTERVAL_TICK = 1;

	let minutes = 0;
	let secondes = 0;
	let remainingPourcentage = 0;
	let timerInterval;

	const startTimer = () => {
		console.log(`Renderer: Starting timer: ${minutes}:${secondes}`);
		window.timer.startTimer(minutes, secondes);
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		timerInterval = setInterval(() => {
			updateTimeLeft();
		}, INTERVAL_TICK);
	}

	const pauseTimer = () => {
		console.log(`Renderer: Pausing timer`);
		window.timer.pauseTimer();
		if (timerInterval) {
			clearInterval(timerInterval);
		}
	}

	const resetTimer = () => {
		console.log(`Renderer: Resetting timer`);
		window.timer.resetTimer();
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		minutes = 0;
		secondes = 0;
		remainingPourcentage = 0;
	}

	const updateTimeLeft = async () => {
		const timeLeft = await window.timer.getTimeLeft();
		remainingPourcentage = timeLeft.endingPourcent;
	}
</script>

<main>
	<div id="container">
		<div id="content">
			<h1>PomoCompanion</h1>
			<div id="timer" style="background: conic-gradient(#243e36 0% {remainingPourcentage}%, #7ca982 {remainingPourcentage}% 100%);">
				<div id="inner-timer">
					
				</div>
			</div>
			<div>
				<p>Choose your timer:</p>
				<input type="number" bind:value={minutes} min="0" max="59">
				<input type="number" bind:value={secondes} min="0" max="59">
			</div>
			<div>
				<button onclick={startTimer}>Play</button>
				<button onclick={pauseTimer}>Pause</button>
				<button onclick={resetTimer}>Reset</button>
			</div>
		</div>
	</div>
</main>

<style>
	
</style>