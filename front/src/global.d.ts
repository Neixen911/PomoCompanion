declare global {
  interface Window {
    timer: {
      startTimer: (minutes: int, secondes: int) => Promise<void>;
      pauseTimer: () => Promise<void>;
      resetTimer: () => Promise<void>;
    };
  }
}

export {};