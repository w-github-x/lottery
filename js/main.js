document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    const lotterySystem = new LotterySystem();
    const ui = new LotteryUI(lotterySystem);
});