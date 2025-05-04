import { API_KEY, API_URL } from './config.js';
import { buildPrompt } from './prompt.js';
import { getAIResponse } from './utils/deepseek.js';

let currentRound = 1;
const maxRounds = 8;
let photoShown = false;
// 移除全局的messageHistory，改用deepseek.js中的playerMessageMap

// ...（保持原有displayMessage、updateUI、triggerEnding等函数不变）

async function handleSubmit() {
  const input = document.getElementById('player-input').value.trim();
  if (!input || currentRound > maxRounds) return;

  displayMessage(input, 'player');

  if (!photoShown && (/photo|picture|image|selfie|proof/i.test(input) || currentRound >= 6)) {
    photoShown = true;
  }

  document.getElementById('submit-btn').disabled = true;

  // 获取当前玩家ID（简单实现，实际应根据游戏逻辑获取）
  const playerId = 'player1'; // 这里应该替换为实际的玩家ID获取逻辑
  
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

// ...（保持其余代码不变）
