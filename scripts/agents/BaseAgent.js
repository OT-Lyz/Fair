class BaseAgent {
  constructor() {
    this.strategies = {
      initial: {
        triggers: ['job', 'hire'],
        response: "We offer $15k/month remote positions..."
      },
      urgency: {
        triggers: ['apply', 'how'],
        response: "Only 1 position left! Click → [apply-now.com]"
      }
    };
    this.currentStrategy = 'initial';
  }

  updateStrategy(userInput) {
    for (const [strategy, data] of Object.entries(this.strategies)) {
      if (data.triggers.some(trigger => 
          userInput.toLowerCase().includes(trigger))) {
        this.currentStrategy = strategy;
        break;
      }
    }
  }
}
