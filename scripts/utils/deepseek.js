import { API_KEY } from '../config.js';

export async function getAIResponse(prompt) {
  try {
    // 新增：估算当前对话token数（简单按字符数计算）
    const estimatedTokens = Math.ceil(JSON.stringify(prompt).length / 3); 
    // 设置max_tokens确保不超过模型限制（假设模型上限为4096）
    const max_tokens = Math.max(256, 4096 - estimatedTokens); // 至少保留256token

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
        max_tokens: max_tokens // 新增：动态控制token
      }),
      timeout: 10000 // 新增：10秒超时确保完整接收
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${errorData.error?.message || await response.text()}`);
    }

    const result = await response.json();
    // 新增：检查响应完整性
    if (!result.choices?.[0]?.message?.content) {
      throw new Error('Incomplete API response');
    }
    return result.choices[0].message.content;
  } catch (error) {
    console.error('API请求失败:', error);
    return "I encountered a technical issue. Please continue our conversation."; // 失败时返回友好提示
  }
}
