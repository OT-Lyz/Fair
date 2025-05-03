const CONFIG = {
  DEEPSEEK_API_KEY: "sk-9f2b2651659145cb9573c3659424f26b", // 替换为实际API密钥
  SAFETY_FILTERS: [
    {
      regex: /transfer money/g,
      replace: "[REDACTED]"
    }
  ]
};
