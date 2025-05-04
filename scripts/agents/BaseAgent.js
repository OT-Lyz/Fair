export class BaseAgent {
  constructor() {
    this.trustScore = 5;
    this.currentStrategy = 'initial';
  }

  updateStrategy(playerInput) {
    if (/not|no|refuse|lie/i.test(playerInput)) {
      this.trustScore -= 1;
    } else if (/yes|okay|sure|interested/i.test(playerInput)) {
      this.trustScore += 1;
    }

    if (this.trustScore > 8) {
      this.currentStrategy = 'push_commitment';
    } else if (this.trustScore > 5) {
      this.currentStrategy = 'gain_trust';
    } else {
      this.currentStrategy = 'reassure';
    }

    this.trustScore = Math.max(0, Math.min(this.trustScore, 10));
  }
}
