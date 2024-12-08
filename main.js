// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const lotterySystem = new LotterySystem();
    const ui = new LotteryUI(lotterySystem);
});