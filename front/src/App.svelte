<script>
	const startTimer = () => {
		// Get minutes and secondes values
		const minutes = document.getElementById('minutes').textContent;
		const secondes = document.getElementById('secondes').textContent;
		console.log(`Renderer: Starting timer`);
		window.timer.startTimer(minutes, secondes);
	}

	const pauseTimer = () => {
		console.log(`Renderer: Pausing timer`);
		window.timer.pauseTimer();
	}

	const resetTimer = () => {
		console.log(`Renderer: Resetting timer`);
		window.timer.resetTimer();
	}
</script>

<main>
	<div id="container">
		<h1>PomoCompanion</h1>
		<div id="timer">
			<div id="inner-timer">

			</div>
		</div>
		<div>
			<p>Choose your timer:</p>
			<input type="number" id="minutes" placeholder="Minutes">
			<input type="number" id="secondes" placeholder="Secondes">
		</div>
		<div>
			<button id="start-timer" onclick={startTimer}>Start</button>
			<button id="pause-timer" onclick={pauseTimer}>Pause</button>
			<button id="reset-timer" onclick={resetTimer}>Reset</button>
		</div>
	</div>
</main>

<style>
	
</style>