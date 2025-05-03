class AlumnusAgent extends BaseAgent {
  constructor() {
    super();
    this.school = "Stanford University";
    this.major = "Computer Science";
  }

  generateAlumniPrompt(input) {
    return `${input}\n[Context: You graduated from ${this.school}. Mention casually]`;
  }
}
