// 初始化游戏
const agent = new AlumnusAgent();
let currentRound = 1;

document.getElementById('submit-btn').addEventListener('click', handleSubmit);
document.querySelector('.fake-link').addEventListener('click', showWarning);

// 处理玩家提交
async function handleSubmit() {
  const inputElement = document.getElementById('player-input');
  const playerText = inputElement.value.trim();
  
  if (!playerText) return;

  // 显示玩家消息
  displayMessage(playerText, 'player');
  
  // 更新AI策略
  agent.detectStrategy(playerText);
  updateDebugInfo();
  
  // 获取AI响应
  const response = await agent.generateResponse(playerText);
  displayMessage(response, 'npc');
  
  // 清理输入框
  inputElement.value = '';
  
  // 更新回合
  currentRound++;
  document.getElementById('round-counter').textContent = currentRound;
  
  // 检查结局
  if (currentRound >= 8) triggerEnding();
}

// 显示消息
function displayMessage(text, sender) {
  const dialogueBox = document.getElementById('dialogue-box');
  const messageDiv = document.createElement('div');
  messageDiv.className = `${sender}-message`;
  messageDiv.innerHTML = `<strong>${sender === 'player' ? 'You' : 'Recruiter'}:</strong> ${text}`;
  dialogueBox.appendChild(messageDiv);
  dialogueBox.scrollTop = dialogueBox.scrollHeight;
}

// 链接警告
function showWarning(e) {
  e.preventDefault();
  displayMessage("[SECURITY WARNING] This is a simulated scam link!", 'system');
}

// 结局触发
function triggerEnding() {
  displayMessage("You were taken to a remote compound. All communications are cut off...", 'ending');
  document.getElementById('submit-btn').disabled = true;
}

// 调试信息更新
function updateDebugInfo() {
  document.getElementById('strategy-display').textContent = agent.currentStrategy.toLowerCase();
}
