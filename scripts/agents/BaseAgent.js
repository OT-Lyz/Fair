class BaseAgent {
  constructor() {
    this.STRATEGIES = {
      INITIAL: {
        triggers: ['job', 'hire'],
        response: "We offer $15k/month for remote work..."
      },
      URGENCY: {
        triggers: ['interested', 'how'],
        response: "Only 1 position left! Apply now:"
      }
    };
    this.currentStrategy = 'INITIAL';
  }

  detectStrategy(playerText) {
    for (const [strategy, data] of Object.entries(this.STRATEGIES)) {
      if (data.triggers.some(trigger => playerText.includes(trigger))) {
        this.currentStrategy = strategy;
        break;
      }
    }
  }
}
