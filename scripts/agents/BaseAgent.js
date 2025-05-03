class BaseAgent {
  constructor() {
    this.currentStrategy = 'initial_contact'; // 确保使用下划线命名
    this.strategies = {
      initial_contact: {
        triggers: ['job', 'hire'],
        response: "We offer $15k/month..."
      },
      urgency_tactic: {
        triggers: ['apply', 'how'],
        response: "Only 1 position left!"
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
