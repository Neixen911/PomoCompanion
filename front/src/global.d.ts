declare global {
    interface Window {
        timer: {
            startTimer: (minutes: int, secondes: int, pauseValue: int, eachTime: int) => Promise<void>;
            pauseTimer: () => Promise<void>;
            resetTimer: () => Promise<void>;
            getTimeLeft: () => Promise<{ hours: int; minutes: int; remaining: int, endingPourcent: int, sessionState: string }>;
            getAllowedMinutesValues: () => Promise<int[]>;
            getAllowedHoursValues: () => Promise<int[]>;
        };
        onYouTubeIframeAPIReady: () => void;
    }

    var YT: any;
}

export { };