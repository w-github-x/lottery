class LotteryUI {
    constructor(lotterySystem) {
        this.lottery = lotterySystem;
        this.animation = new AnimationManager();
        this.isDrawing = false;
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
    }

    initializeElements() {
        this.elements = {
            nameList: document.getElementById('nameList'),
            drawCount: document.getElementById('drawCount'),
            drawButton: document.getElementById('drawButton'),
            clearButton: document.getElementById('clearButton'),
            drawAnimation: document.getElementById('drawAnimation'),
            historyList: document.getElementById('historyList'),
            totalParticipants: document.getElementById('totalParticipants'),
            totalDrawn: document.getElementById('totalDrawn'),
            remainingCount: document.getElementById('remainingCount')
        };
    }

    bindEvents() {
        this.elements.nameList.addEventListener('input', () => {
            this.lottery.setParticipants(this.elements.nameList.value);
            this.updateUI();
        });

        this.elements.drawButton.addEventListener('click', () => {
            if (!this.isDrawing) {
                this.startDraw();
            }
        });

        this.elements.clearButton.addEventListener('click', () => {
            this.lottery.clearAll();
            this.elements.nameList.value = '';
            this.animation.clearWinnersList();
            this.updateUI();
        });
    }

    async startDraw() {
        if (this.isDrawing) return;
        
        const count = parseInt(this.elements.drawCount.value) || 1;
        const available = this.lottery.getAvailableParticipants();
        
        if (available.length === 0) {
            alert('没有可抽取的参与者！');
            return;
        }

        this.isDrawing = true;
        this.elements.drawButton.disabled = true;
        this.animation.clearWinnersList();
        
        const winners = this.lottery.draw(count);
        
        // Animate each winner sequentially
        for (let i = 0; i < winners.length; i++) {
            const winner = winners[i];
            
            // Animate random names before showing the winner
            const animationDuration = this.animation.getAnimationDuration();
            const startTime = Date.now();
            
            while (Date.now() - startTime < animationDuration) {
                const randomName = available[utils.getRandomInt(0, available.length - 1)];
                this.elements.drawAnimation.querySelector('.winner-name').textContent = randomName;
                await utils.sleep(50);
            }
            
            // Show the actual winner
            await this.animation.animateWinner(winner, i, winners.length);
            this.animation.addWinnerCard(winner, i, winners.length);
            await utils.sleep(500);
        }
        
        this.updateUI();
        this.isDrawing = false;
        this.elements.drawButton.disabled = false;
    }

    updateUI() {
        // Update summary
        const summary = this.lottery.getSummary();
        this.elements.totalParticipants.textContent = summary.totalParticipants;
        this.elements.totalDrawn.textContent = summary.totalDrawn;
        this.elements.remainingCount.textContent = summary.remainingCount;

        // Update history
        this.elements.historyList.innerHTML = this.lottery.history
            .map(entry => `
                <div class="history-item">
                    <div class="timestamp">${utils.formatDate(entry.timestamp)}</div>
                    <div class="winners">抽取 ${entry.drawCount} 人：${entry.winners.join('、')}</div>
                </div>
            `)
            .join('');
    }
}