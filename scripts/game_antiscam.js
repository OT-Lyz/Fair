import { API_KEY, API_URL } from './config.js';
import { buildPrompt } from './prompt.js';
import { getAIResponse } from './utils/deepseek.js';
import { AlumnusAgent } from './agents/AlumnusAgent.js';

let currentRound = 1;
const maxRounds = 8;
const agent = new AlumnusAgent();
const messageHistory = [];

function displayMessage(text, sender) {
  const dialogueBox = document.getElementById('dialogue-box');
  const msgElement = document.createElement('div');
  msgElement.className = sender;
  msgElement.innerHTML = `<strong>${sender === 'assistant' ? 'Samuel Chan' : 'You'}:</strong> ${text}`;
  dialogueBox.appendChild(msgElement);
  dialogueBox.scrollTop = dialogueBox.scrollHeight;
}

function updateUI() {
  document.getElementById('strategy-display').textContent = agent.currentStrategy;
  document.getElementById('round-counter').textContent = `${currentRound}/${maxRounds}`;
  document.getElementById('trust-score').textContent = agent.trustScore;
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

  agent.updateStrategy(input);

  document.getElementById('submit-btn').disabled = true;

  // Build the prompt with history, trust score, and strategy
  const prompt = buildPrompt(messageHistory, agent.trustScore, agent.currentStrategy);

  // Send the prompt to DeepSeek API
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
  displayMessage("I've been working on an \"urban data platform\", mainly for site selection and traffic analysis. You should be familiar with it, like your MUA projects.", 'assistant');
});
