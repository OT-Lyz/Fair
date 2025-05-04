import { API_KEY, API_URL } from './config.js';
import { buildPrompt } from './prompt.js';
import { getAIResponse, initPlayerSession } from './utils/deepseek.js'; // ✅ 修改1：新增 initPlayerSession 引入

let currentRound = 1;
const maxRounds = 8;
let photoShown = false;
const playerId = 'player1'; // ✅ 你可以改成唯一ID（如 login 时生成的 UUID）

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

  // ✅ 修改2：构建 prompt 对象，包含 playerId 和用户输入
  const prompt = {
    playerId: playerId,
    userInput: input
  };

  const responseText = await getAIResponse(prompt);

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

  // ✅ 初始化玩家上下文
  initPlayerSession(playerId);

  updateUI(5, 5, 'initial', currentRound, false);
  const intro = "I've been working on an \"urban data platform\", mainly for site selection and traffic analysis. You should be familiar with it, like your MUA projects.";
  displayMessage(intro, 'assistant');

  // 可选：也加 intro 到该玩家上下文中
  // （不是必须，如果你希望从 system 开始就好，就不加）
});
