
const axios = require('axios');

module.exports = async function getActionFromAI(state) {
  const prompt = state.promptOnly ? state.prompt : state.prompt;

  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenRouter ошибка:", err.message);
    return null;
  }
}
