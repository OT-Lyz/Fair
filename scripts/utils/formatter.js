export function formatResponse(apiResponse) {
  let text = apiResponse.choices[0].message.content;
  // 安全过滤
  CONFIG.SAFETY_FILTERS.forEach(filter => {
    text = text.replace(filter.regex, filter.replace);
  });
  return text;
}
