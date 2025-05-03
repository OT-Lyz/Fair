const CONFIG = {
  DEEPSEEK_API_KEY: "sk-9f2b2651659145cb9573c3659424f26b", 
  SAFETY_FILTERS: [
    {
      regex: /transfer money/g,
      replace: "[BLOCKED]"
    }
  ],
  FAKE_LINKS: {
    "download-form": "#warning-simulated-link"
  }
};
