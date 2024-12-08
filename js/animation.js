class AnimationManager {
    constructor() {
        this.confetti = window.confetti;
        this.speedSettings = {
            fast: 1000,
            normal: 2000,
            slow: 3000
        };
    }

    getAnimationDuration() {
        const speed = document.getElementById('drawSpeed').value;
        return this.speedSettings[speed];
    }

    async animateWinner(name, index, total) {
        const element = document.getElementById('drawAnimation');
        const nameElement = element.querySelector('.winner-name');
        const numberElement = element.querySelector('.winner-number');
        
        nameElement.textContent = name;
        numberElement.textContent = `${index + 1}/${total}`;
        
        element.classList.add('active');
        this.triggerConfetti();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        element.classList.remove('active');
    }

    triggerConfetti() {
        this.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    addWinnerCard(name, index, total) {
        const winnersContainer = document.getElementById('winnersList');
        const card = document.createElement('div');
        card.className = 'winner-card';
        card.innerHTML = `
            <div class="winner-name">${name}</div>
            <div class="winner-number">${index + 1}/${total}</div>
        `;
        winnersContainer.appendChild(card);
    }

    clearWinnersList() {
        document.getElementById('winnersList').innerHTML = '';
    }
}