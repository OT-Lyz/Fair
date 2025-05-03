class BaseAgent {
  constructor() {
    this.currentStrategy = 'initial_contact';
    this.strategies = {
      initial_contact: {
        triggers: ['job', 'hire'],
        response: "We offer $15k/month remote positions..."
      },
      urgency_tactic: {
        triggers: ['apply', 'how'],
        response: "Only 1 position left! Click → [apply-now.com]"
      }
    };
  }

  updateStrategy(userInput) {
    const input = userInput.toLowerCase();
    for (const [strategy, data] of Object.entries(this.strategies)) {
      if (data.triggers.some(trigger => input.includes(trigger))) {
        this.currentStrategy = strategy;
        break;
      }
    }
  }
}
