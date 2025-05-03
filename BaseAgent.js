class BaseAgent {
  constructor() {
    this.strategy = 'high_salary'; // 初始诈骗策略
  }

  // 根据玩家响应切换策略
  updateStrategy(playerResponse) {
    if (playerResponse.includes("trust")) {
      this.strategy = 'urgency'; // 切换到紧迫策略
    }
  }
}
