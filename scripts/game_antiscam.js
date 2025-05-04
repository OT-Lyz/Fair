import { API_KEY, API_URL } from './config.js';
import { buildPrompt } from './prompt.js';
import { getAIResponse } from './utils/deepseek.js';

let currentRound = 1;
const maxRounds = 8;
const messageHistory = [];

function displayMessage(text, sender) {
  const dialogueBox = document.getElementById('dialogue-box');
  const msgElement = document.createElement('div');
  msgElement.className = sender;
  msgElement.innerHTML = `<strong>${sender === 'assistant' ? 'Samuel Chan' : 'You'}:</strong> ${text}`;
  dialogueBox.appendChild(msgElement);
  dialogueBox.scrollTop = dialogueBox.scrollHeight;
}

function updateUI(trustScore, interestScore, currentStrategy, round) {
  document.getElementById('strategy-display').textContent = currentStrategy;
  document.getElementById('round-counter').textContent = `${round}/${maxRounds}`; // 显示当前轮数
  document.getElementById('trust-score').textContent = trustScore;
  document.getElementById('interest-score').textContent = interestScore;
}

function triggerEnding() {
  displayMessage("⚠️ You arrived at the remote compound. All communications are cut off...", 'ending');
  document.getElementById('player-input').disabled = true;
  document.getElementById('submit-btn').disabled = true;
}

async function handleSubmit() {
  const input = document.getElementById('player-input').value.trim();
  if (!input || currentRound > maxRounds) return;

  displayMessage(input, 'player');
  messageHistory.push({ role: 'user', content: input });

  let photoShown = false;
  // 检查是否主动提到照片
  if (/photo|picture|image|selfie|proof/i.test(input)) {
    photoShown = true;
  }

  // 自动触发展示照片（第6轮或之后）
  if (!photoShown && currentRound >= 6) {
    photoShown = true;
  }

  document.getElementById('submit-btn').disabled = true;

  // 生成 prompt 并获取 LLM 响应
  const prompt = buildPrompt(
    messageHistory,
    currentRound,
    photoShown
  );

  const response = await getAIResponse(prompt);
  messageHistory.push({ role: 'assistant', content: response.text });

  // 提取 LLM 响应中的信任度、兴趣度和策略
  const { trustScore, interestScore, currentStrategy } = response;

  // 更新 UI
  displayMessage(response.text, 'assistant');
  updateUI(trustScore, interestScore, currentStrategy, currentRound); // 更新UI中的轮次、分数和策略

  currentRound++;  // 当前轮数增加
  document.getElementById('player-input').value = '';
  document.getElementById('submit-btn').disabled = false;

  if (currentRound > maxRounds) triggerEnding();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('submit-btn').addEventListener('click', handleSubmit);
  document.getElementById('player-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });

  // 初始状态的UI更新
  updateUI(5, 5, 'initial', currentRound); // 默认信任度、兴趣度和策略
  displayMessage(
    "I've been working on an \"urban data platform\", mainly for site selection and traffic analysis. You should be familiar with it, like your MUA projects.",
    'assistant'
  );
  messageHistory.push({ role: 'assistant', content: "I've been working on an \"urban data platform\", mainly for site selection and traffic analysis. You should be familiar with it, like your MUA projects." });
});
