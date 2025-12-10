declare global {
    interface Window {
        timer: {
            startTimer: (minutes: int, secondes: int) => Promise<void>;
            pauseTimer: () => Promise<void>;
            resetTimer: () => Promise<void>;
            getTimeLeft: () => Promise<{ minutes: int; secondes: int; remaining: int, endingPourcent: int }>;
        };
    }
}

export { };