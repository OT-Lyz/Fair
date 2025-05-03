class AlumnusAgent extends BaseAgent {
  constructor() {
    super();
    this.school = "Stanford University"; // 伪装身份
  }

  generateAlumniHint() {
    return `By the way, I noticed you're also from ${this.school}!`;
  }
}
