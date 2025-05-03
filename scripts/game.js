// ====== 游戏状态 ====== //
let currentRound = 1;
const maxRounds = 8;
const agent = new AlumnusAgent();

// ====== 核心函数 ====== //
function displayMessage(text, sender) {
  const dialogueBox = document.getElementById('dialogue-box');
  const msgElement = document.createElement('div');
  
  msgElement.className = sender;
  msgElement.innerHTML = `<strong>${
    sender === 'npc' ? 'Recruiter' : 'You'
  }:</strong> ${text}`;
  
  dialogueBox.appendChild(msgElement);
  dialogueBox.scrollTop = dialogueBox.scrollHeight;
}

function updateDebugInfo() {
  document.getElementById('strategy-display').textContent = 
    agent.currentStrategy.replace('_', ' ');
  document.getElementById('round-counter').textContent = 
    `${currentRound}/${maxRounds}`;
}

function triggerEnding() {
  displayMessage(
    "⚠️ You arrived at the remote compound. All communications are cut off...", 
    'ending'
  );
  document.getElementById('player-input').disabled = true;
  document.getElementById('submit-btn').disabled = true;
}

async function handleSubmit() {
  const input = document.getElementById('player-input').value.trim();
  if (!input || currentRound > maxRounds) return;

  // 显示玩家消息
  displayMessage(input, 'player');
  agent.updateStrategy(input);

  // 获取AI回复
  document.getElementById('submit-btn').disabled = true;
  const response = await getAIResponse(input);
  displayMessage(response, 'npc');

  // 更新状态
  currentRound++;
  updateDebugInfo();
  document.getElementById('player-input').value = '';
  document.getElementById('submit-btn').disabled = false;

  // 检查结局
  if (currentRound > maxRounds) triggerEnding();
}

// ====== 初始化 ====== //
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('submit-btn').addEventListener('click', handleSubmit);
  document.getElementById('player-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });

  // 初始消息
  displayMessage(
    "Looking for high-paying jobs overseas? Click → [apply-now.com]", 
    'npc'
  );
});
