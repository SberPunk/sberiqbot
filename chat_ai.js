
const axios = require('axios');

module.exports = async function chatAI(username, message) {
  const prompt = `Ты Minecraft-бот с ИИ. Игрок "${username}" говорит: "${message}". Ответь как обычный игрок Minecraft.`;

  try {
    const res = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error('Ошибка DeepSeek:', err.message);
    return "🤖 Что-то пошло не так...";
  }
}
