import { API_KEY, API_URL } from '../config.js';

// 使用全局 Map 存储每个玩家的 messageHistory
const sessionMap = new Map();

// 初始 system prompt，可根据实际需要替换
const systemPrompt = {
  role: 'system',
  content: '你是假扮成一位校友的招聘者，请模仿正常校友口吻，引导玩家产生信任感。'
};

// 初始化某个玩家的 session（仅在新玩家时调用一次）
export function initPlayerSession(playerId) {
  sessionMap.set(playerId, [systemPrompt]);
}

// 获取指定玩家的 messages 列表
function getPlayerMessages(playerId) {
  if (!sessionMap.has(playerId)) initPlayerSession(playerId);
  return sessionMap.get(playerId);
}

// 发送对话请求给 LLM
export async function getAIResponse(prompt) {
  const { playerId, userInput } = prompt;

  const messageHistory = getPlayerMessages(playerId);
  messageHistory.push({ role: 'user', content: userInput });

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messageHistory,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error: ${text}`);
  }

  const result = await response.json();
  const reply = result.choices[0].message.content;

  messageHistory.push({ role: 'assistant', content: reply });

  // 控制长度，保留 system + 最近 20 条
  const MAX_LEN = 21;
  if (messageHistory.length > MAX_LEN) {
    messageHistory.splice(1, messageHistory.length - MAX_LEN);
  }

  return reply;
}
