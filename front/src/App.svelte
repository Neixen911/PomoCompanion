<script>
	import { onMount } from 'svelte';

	const INTERVAL_TICK = 1;

	let allowedMinutesValues = [];
	let minutesValue;
	let allowedHoursValues = [];
	let hoursValue;

	onMount(async () => {
		allowedMinutesValues = await window.timer.getAllowedMinutesValues();
		minutesValue = allowedMinutesValues[0];
		allowedHoursValues = await window.timer.getAllowedHoursValues();
		hoursValue = allowedHoursValues[0];
	});

	let remainingPourcentage = 0;
	let timerInterval;

	const startTimer = () => {
		console.log(`Renderer: Starting timer: ${hoursValue}:${minutesValue}`);
		window.timer.startTimer(hoursValue, minutesValue);
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		timerInterval = setInterval(() => {
			updateTimeLeft();
		}, INTERVAL_TICK);
	};

	const pauseTimer = () => {
		console.log(`Renderer: Pausing timer`);
		window.timer.pauseTimer();
		if (timerInterval) {
			clearInterval(timerInterval);
		}
	};

	const resetTimer = () => {
		console.log(`Renderer: Resetting timer`);
		window.timer.resetTimer();
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		hoursValue = 0;
		minutesValue = 0;
		remainingPourcentage = 0;
	};

	const updateTimeLeft = async () => {
		const timeLeft = await window.timer.getTimeLeft();
		remainingPourcentage = timeLeft.endingPourcent;
	};
</script>

<main>
	<div id="container">
		<div id="content">
			<h1>PomoCompanion</h1>
			<div
				id="timer"
				style="background: conic-gradient(#243e36 0% {remainingPourcentage}%, #7ca982 {remainingPourcentage}% 100%);"
			>
				<div id="inner-timer"></div>
			</div>
			<div>
				<p>Choose your timer:</p>
				<select bind:value={hoursValue}>
					{#each allowedHoursValues as v}
						<option value={v}>{v}</option>
					{/each}
				</select>
				<select bind:value={minutesValue}>
					{#each allowedMinutesValues as v}
						<option value={v}>{v}</option>
					{/each}
				</select>
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
