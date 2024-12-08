class LotterySystem {
    constructor() {
        this.participants = [];
        this.drawnParticipants = new Set();
        this.history = [];
        this.loadState();
    }

    loadState() {
        const savedState = utils.loadFromStorage('lotteryState');
        if (savedState) {
            this.participants = savedState.participants;
            this.drawnParticipants = new Set(savedState.drawnParticipants);
            this.history = savedState.history;
        }
    }

    saveState() {
        utils.saveToStorage('lotteryState', {
            participants: this.participants,
            drawnParticipants: Array.from(this.drawnParticipants),
            history: this.history
        });
    }

    setParticipants(namesText) {
        this.participants = namesText
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        this.drawnParticipants.clear();
        this.saveState();
    }

    getAvailableParticipants() {
        return this.participants.filter(name => !this.drawnParticipants.has(name));
    }

    draw(count) {
        const available = this.getAvailableParticipants();
        if (available.length === 0) return [];
        
        count = Math.min(count, available.length);
        const shuffled = utils.shuffleArray([...available]);
        const winners = shuffled.slice(0, count);
        
        winners.forEach(winner => this.drawnParticipants.add(winner));
        
        const historyEntry = {
            timestamp: new Date().toISOString(),
            winners: winners,
            drawCount: count
        };
        this.history.unshift(historyEntry);
        
        this.saveState();
        return winners;
    }

    getSummary() {
        return {
            totalParticipants: this.participants.length,
            totalDrawn: this.drawnParticipants.size,
            remainingCount: this.participants.length - this.drawnParticipants.size
        };
    }

    clearAll() {
        this.participants = [];
        this.drawnParticipants.clear();
        this.history = [];
        this.saveState();
    }
}