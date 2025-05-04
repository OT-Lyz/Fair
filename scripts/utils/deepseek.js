import { API_KEY, API_URL } from '../config.js';

// 存储每个玩家的对话历史
const playerMessageMap = new Map();

export async function getAIResponse(prompt, playerId = 'default') {
  // 获取或初始化该玩家的对话历史
  if (!playerMessageMap.has(playerId)) {
    playerMessageMap.set(playerId, []);
  }
  const playerMessages = playerMessageMap.get(playerId);
  
  // 计算token大致数量（简单估算：1个汉字≈2token，1个英文单词≈1.33token）
  const estimateTokens = (text) => Math.ceil(text.length * 0.6);
  const promptTokens = estimateTokens(JSON.stringify(prompt));
  
  // 设置max_tokens，确保不超过模型限制（假设使用128k模型）
  const max_tokens = Math.max(512, 4096 - promptTokens); // 至少保留512token用于生成

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: prompt,
        temperature: 0.7,
        max_tokens: max_tokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;
    
    // 更新玩家对话历史
    playerMessages.push(...prompt.filter(m => m.role !== 'system'));
    playerMessages.push({ role: 'assistant', content: aiResponse });
    
    return aiResponse;
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
}
