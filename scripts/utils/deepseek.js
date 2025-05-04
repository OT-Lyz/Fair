async function getAIResponse(history, trustScore, strategy) {
  const prompt = buildPrompt(history, trustScore, strategy);
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: prompt
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
