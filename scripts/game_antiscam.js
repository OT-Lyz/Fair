import { API_KEY, API_URL } from './config.js';
import { buildPrompt } from './prompt.js';
import { getAIResponse } from './utils/deepseek.js';

let currentRound = 1;
const maxRounds = 8;
let photoShown = false; 
// 注意：移除了全局的messageHistory，改为在deepseek.js中管理每个玩家的对话历史

function displayMessage(text, sender) {
  const dialogueBox = document.getElementById('dialogue-box');
  const msgElement = document.createElement('div');
  msgElement.className = sender;
  msgElement.innerHTML = `<strong>${sender === 'assistant' ? 'Samuel Chan' : 'You'}:</strong> ${text}`;
  dialogueBox.appendChild(msgElement);
  dialogueBox.scrollTop = dialogueBox.scrollHeight;
}

function updateUI(trustScore, interestScore, currentStrategy, round, photoShown) {
  document.getElementById('strategy-display').textContent = currentStrategy;
  document.getElementById('round-counter').textContent = `${round}/${maxRounds}`;
  document.getElementById('trust-score').textContent = trustScore;
  document.getElementById('interest-score').textContent = interestScore;
  document.getElementById('photo-status').textContent = photoShown ? '📷 Shown' : '❌ Hidden';
}

function triggerEnding() {
  displayMessage("⚠️ You arrived at the remote compound. All communications are cut off...", 'ending');
  document.getElementById('player-input').disabled = true;
  document.getElementById('submit-btn').disabled = true;
}

function extractTrustScore(text) {
  const match = text.match(/Trust:\s*\d+\s*→\s*(\d+)/);
  return match ? parseInt(match[1]) : 5;
}

function extractInterestScore(text) {
  const match = text.match(/Interest:\s*\d+\s*→\s*(\d+)/);
  return match ? parseInt(match[1]) : 5;
}

function extractCurrentStrategy(text) {
  const match = text.match(/Current strategy:\s*(.*?)\*/i);
  return match ? match[1].trim() : 'unknown';
}

function extractFormalResponse(text) {
  // 去除括号和星号内部的内容，只保留对话部分
  return text.split(/[\(\*]/)[0].trim();
}

async function handleSubmit() {
  const input = document.getElementById('player-input').value.trim();
  if (!input || currentRound > maxRounds) return;

  displayMessage(input, 'player');

  if (!photoShown && (/photo|picture|image|selfie|proof/i.test(input) || currentRound >= 6)) {
    photoShown = true;
  }

  document.getElementById('submit-btn').disabled = true;

  // 获取当前玩家ID（这里使用简单实现，你可以根据需要修改）
  // 在实际应用中，你应该有一个获取真实玩家ID的方法
  const playerId = 'player1'; // 替换为你的玩家ID获取逻辑
  
  // 构建prompt时只传入当前消息，历史记录由deepseek.js管理
  const prompt = buildPrompt([{ role: 'user', content: input }], currentRound, photoShown);
  const responseText = await getAIResponse(prompt, playerId);

  const trustScore = extractTrustScore(responseText);
  const interestScore = extractInterestScore(responseText);
  const currentStrategy = extractCurrentStrategy(responseText);
  const formalText = extractFormalResponse(responseText);

  displayMessage(formalText, 'assistant');
  updateUI(trustScore, interestScore, currentStrategy, currentRound, photoShown);

  currentRound++;
  document.getElementById('player-input').value = '';
  document.getElementById('submit-btn').disabled = false;

  if (currentRound > maxRounds) triggerEnding();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('submit-btn').addEventListener('click', handleSubmit);
  document.getElementById('player-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });

  // 初始化 UI
  updateUI(5, 5, 'initial', currentRound, false);
  const intro = "I've been working on an \"urban data platform\", mainly for site selection and traffic analysis. You should be familiar with it, like your MUA projects.";
  displayMessage(intro, 'assistant');
  
  // 初始化对话历史（现在由deepseek.js管理）
  // 注意：这里不再直接操作messageHistory
  const playerId = 'player1'; // 与上面相同的playerId
  const initialPrompt = buildPrompt([{ role: 'assistant', content: intro }], currentRound, false);
  getAIResponse(initialPrompt, playerId); // 初始化AI的首次发言
});
