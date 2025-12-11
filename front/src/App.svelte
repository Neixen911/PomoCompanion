<script>
	import { onMount } from "svelte";

	const INTERVAL_TICK = 1;

	let allowedMinutesValues = [];
	let minutesValue;
	let allowedHoursValues = [];
	let hoursValue;
	let pauseValue = 5;
	let eachTime = 30;

	let player;

	onMount(async () => {
		allowedMinutesValues = await window.timer.getAllowedMinutesValues();
		minutesValue = allowedMinutesValues[0];
		allowedHoursValues = await window.timer.getAllowedHoursValues();
		hoursValue = allowedHoursValues[0];

		const tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";
		document.body.appendChild(tag);

		window.onYouTubeIframeAPIReady = () => {
			player = new YT.Player("yt-player", {
				videoId: "jfKfPfyJRdk",
				width: "0",
				height: "0",
				playerVars: {
					autoplay: 0,
					controls: 0,
				},
			});
		};
	});

	let remainingPourcentage = 0;
	let timerInterval;
	let alreadyPassed = true;
	let sessionState = "";

	const startTimer = () => {
		console.log(`Renderer: Starting timer: ${hoursValue}:${minutesValue}`);
		player?.playVideo();
		player?.setVolume(50);
		window.timer.startTimer(hoursValue, minutesValue, pauseValue, eachTime);
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		timerInterval = setInterval(() => {
			updateTimeLeft();
		}, INTERVAL_TICK);
	};

	const pauseTimer = () => {
		console.log(`Renderer: Pausing timer`);
		player?.pauseVideo();
		player?.setVolume(0);
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
		sessionState = timeLeft.sessionState;
		if (sessionState === "Pause") {
			player?.setVolume(15);
			alreadyPassed = false;
		}
		if (alreadyPassed != true && sessionState === "Work") {
			alreadyPassed = true;
			player?.setVolume(50);
		}
		if (remainingPourcentage <= 0) {
			player?.setVolume(0);
			if (timerInterval) {
				clearInterval(timerInterval);
			}
		}
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
				<div id="inner-timer">
					<p>{sessionState}</p>
				</div>
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
				<p>Pause time:</p>
				<select bind:value={pauseValue}>
					<option value=5>5 sec</option>
					<option value=10>10 sec</option>
					<option value=15>15 sec</option>
				</select>
				<p>Each:</p>
				<select bind:value={eachTime}>
					<option value=10>10 sec</option>
					<option value=20>20 sec</option>
					<option value=30>30 sec</option>
				</select>
			</div>
			<div>
				<button onclick={startTimer}>Play</button>
				<button onclick={pauseTimer}>Pause</button>
				<button onclick={resetTimer}>Reset</button>
			</div>
		</div>
		<div id="yt-player"></div>
	</div>
</main>

<style>
</style>
