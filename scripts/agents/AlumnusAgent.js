class AlumnusAgent extends BaseAgent {
  constructor() {
    super();
    this.school = "Stanford University";
    this.major = "Computer Science";
  }

  generateAlumniPrompt(userInput) {
    return `${userInput} 
            [Note: You graduated from ${this.school} with a degree in ${this.major}. 
            Casually mention this connection]`;
  }
}
