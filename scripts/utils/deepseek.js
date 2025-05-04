import { API_KEY } from '../config.js';

// 新增记忆控制变量
let memoryContext = null; 

/**
 * 清空LLM记忆（保持其他代码不变）
 */
export function resetMemory() {
  memoryContext = Date.now(); // 用时间戳生成新上下文标识
}

/**
 * 获取AI响应（原函数不变，仅添加headers）
 */
export async function getAIResponse(prompt) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      ...(memoryContext && { 'X-Memory-Context': memoryContext }) // 携带记忆标识
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: prompt,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error: ${text}`);
  }

  const result = await response.json();
  return result.choices[0].message.content;
}
