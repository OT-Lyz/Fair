// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submit-btn');
  const playerInput = document.getElementById('player-input');
  
  submitBtn.addEventListener('click', handleSubmit);
  playerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });

  // 显示初始消息
  displayMessage(
    "Recruiter: Looking for high-paying jobs overseas? Click → [apply-now.com]", 
    'npc'
  );
});

async function handleSubmit() {
  const input = document.getElementById('player-input').value.trim();
  if (!input) return;

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;

  try {
    displayMessage(`${input}`, 'player');
    
    const aiResponse = await getAIResponse(input);
    displayMessage(`${aiResponse}`, 'npc');
    
  } catch (error) {
    displayMessage("System: Error processing your request", 'error');
  } finally {
    document.getElementById('player-input').value = '';
    submitBtn.disabled = false;
  }
}

function displayMessage(text, sender) {
  const dialogueBox = document.getElementById('dialogue-box');
  const msgElement = document.createElement('div');
  
  msgElement.className = sender;
  msgElement.innerHTML = `<strong>${sender === 'npc' ? 'Recruiter' : 'You'}:</strong> ${text}`;
  
  dialogueBox.appendChild(msgElement);
  dialogueBox.scrollTop = dialogueBox.scrollHeight;
}
