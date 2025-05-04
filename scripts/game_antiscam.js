import { API_KEY, API_URL } from './config.js';
import { buildPrompt } from './prompt.js';
import { getAIResponse } from './utils/deepseek.js';

let currentRound = 1;
const maxRounds = 8;
const messageHistory = [];

let trustScore = 5;
let interestScore = 5;
let currentStrategy = 'initial';
let hasShownPhoto = false;

function displayMessage(text, sender) {
  const dialogueBox = document.getElementById('dialogue-box');
  const msgElement = document.createElement('div');
  msgElement.className = sender;
  msgElement.innerHTML = `<strong>${sender === 'assistant' ? 'Samuel Chan' : 'You'}:</strong> ${text}`;
  dialogueBox.appendChild(msgElement);
  dialogueBox.scrollTop = dialogueBox.scrollHeight;
}

function updateScores(playerInput) {
  if (/not|no|refuse|lie|scam|fake/i.test(playerInput)) {
    trustScore -= 1;
  } else if (/yes|okay|sure|interested|good idea/i.test(playerInput)) {
    trustScore += 1;
  }

  if (/where|location|address|when|time|schedule/i.test(playerInput)) {
    interestScore += 1;
  } else if (/why|wait|hold on|risk|doubt/i.test(playerInput)) {
    interestScore -= 1;
  }

  trustScore = Math.max(0, Math.min(10, trustScore));
  interestScore = Math.max(0, Math.min(10, interestScore));

  // 简化策略决策逻辑
  if (trustScore > 8 && interestScore > 7) {
    currentStrategy = 'push_commitment';
  } else if (trustScore > 5 || interestScore > 5) {
    currentStrategy = 'gain_trust';
  } else {
    currentStrategy = 'reassure';
  }
}

function updateUI() {
  document.getElementById('strategy-display').textContent = currentStrategy;
  document.getElementById('round-counter').textContent = `${currentRound}/${maxRounds}`;
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

  updateScores(input);

  // 玩家主动提及“照片”，设置标记
  if (/photo|picture|image/i.test(input)) {
    hasShownPhoto = true;
  }

  document.getElementById('submit-btn').disabled = true;

  const prompt = buildPrompt(
    messageHistory,
    trustScore,
    interestScore,
    currentStrategy,
    currentRound,
    hasShownPhoto
  );

  const response = await getAIResponse(prompt);
  messageHistory.push({ role: 'assistant', content: response });

  displayMessage(response, 'assistant');
  currentRound++;
  updateUI();
  document.getElementById('player-input').value = '';
  document.getElementById('submit-btn').disabled = false;

  if (currentRound > maxRounds) triggerEnding();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('submit-btn').addEventListener('click', handleSubmit);
  document.getElementById('player-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });

  updateUI();
  displayMessage(
    "I've been working on an \"urban data platform\", mainly for site selection and traffic analysis. You should be familiar with it, like your MUA projects.",
    'assistant'
  );
});
