declare global {
    interface Window {
        timer: {
            startTimer: (minutes: int, secondes: int) => Promise<void>;
            pauseTimer: () => Promise<void>;
            resetTimer: () => Promise<void>;
            getTimeLeft: () => Promise<{ hours: int; minutes: int; remaining: int, endingPourcent: int }>;
            getAllowedMinutesValues: () => Promise<int[]>;
            getAllowedHoursValues: () => Promise<int[]>;
        };
    }
}

export { };