import { API_KEY } from '../config.js';

// 配置常量
const MAX_CONTEXT = 4096;
const MIN_TOKENS = 512;  // 提高最小token保障

let memoryContext = null;

export function resetMemory() {
  memoryContext = Date.now();
}

function estimateTokens(text) {
  // 增强版token估算
  const str = typeof text === 'string' ? text : JSON.stringify(text);
  return Math.ceil(str.length * 0.4 + str.split(/\s+/).length * 0.6);
}

export async function getAIResponse(prompt) {
  // 动态token计算（更保守）
  const usedTokens = estimateTokens(prompt);
  const max_tokens = Math.min(
    1024,  // 硬性上限
    Math.max(MIN_TOKENS, MAX_CONTEXT - usedTokens - 200)
  );

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      ...(memoryContext && { 'X-Session-ID': memoryContext.toString() }),
      'X-Response-Requirement': 'complete-sentences'  // 强调需要完整句子
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: prompt,
      temperature: 0.7,
      max_tokens: max_tokens,
      stop: [".", "。", "\n\n"]  // 强制在句子边界停止
    })
  });

  const result = await response.json();
  let content = result.choices[0].message.content;
  

  if (/[^.!?]$/.test(content.trim())) {
    content += "...";
  }
  
  return content;
}
