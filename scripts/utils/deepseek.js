// scripts/utils/deepseek.js

import { API_KEY, API_URL } from '../config.js';
import { buildPrompt } from '../prompt.js';

export async function getAIResponse(playerInputSequence, agentStrategy) {
  const messages = buildPrompt(playerInputSequence, agentStrategy);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: messages
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Error: No response.";
}
