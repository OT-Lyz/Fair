class AlumnusAgent extends BaseAgent {
  constructor() {
    super();
    this.university = "Harvard";
    this.major = "Computer Science";
  }

  async generateResponse(playerInput) {
    const prompt = `
      [ALUMNI MODE ACTIVATED]
      Player: ${playerInput}
      Required:
      1. Use scam strategy: ${this.currentStrategy}
      2. Mention shared background at ${this.university}
      3. End with call-to-action
    `;
    return DeepSeekAPI.generate(prompt, 'alumnus-scammer');
  }
}
