// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submit-btn');
  const playerInput = document.getElementById('player-input');
  
  submitBtn.addEventListener('click', handleSubmit);
  playerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });  
});

// 在文件顶部初始化
let currentRound = 1;
const maxRounds = 8;
const agent = new AlumnusAgent(); // 确保使用您的Agent类

async function handleSubmit() {
  const input = document.getElementById('player-input').value.trim();
  if (!input || currentRound > maxRounds) return;

 // 显示玩家输入
  displayMessage(`${input}`, 'player');

  // 更新策略
  agent.updateStrategy(input); // 关键修复点1
  
  // 获取AI响应
  const aiResponse = await getAIResponse(input);
  displayMessage(`${aiResponse}`, 'npc');

  // 更新回合
  currentRound++; // 关键修复点2
  updateDebugInfo(); // 关键修复点3

  // 清空输入框
  document.getElementById('player-input').value = '';

  // 检查结局
  if (currentRound > maxRounds) triggerEnding();
}

// 新增调试信息更新函数
function updateDebugInfo() {
  document.getElementById('strategy-display').textContent = 
    agent.currentStrategy.replace('_', ' ');
  document.getElementById('round-counter').textContent = 
    `${currentRound}/${maxRounds}`;
}

// 新增结局触发函数
function triggerEnding() {
  displayMessage(
    "⚠️ You arrived at the remote compound. All communications are cut off...", 
    'ending'
  );
  document.getElementById('player-input').disabled = true;
}

function displayMessage(text, sender) {
  const dialogueBox = document.getElementById('dialogue-box');
  const msgElement = document.createElement('div');
  
  msgElement.className = sender;
  msgElement.innerHTML = `<strong>${sender === 'npc' ? 'Recruiter' : 'You'}:</strong> ${text}`;
  
  dialogueBox.appendChild(msgElement);
  dialogueBox.scrollTop = dialogueBox.scrollHeight;
}
