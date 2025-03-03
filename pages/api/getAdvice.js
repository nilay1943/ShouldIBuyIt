import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { monthlyIncome, itemName, itemPrice } = req.body;

    const prompt = `You're a sassy, slightly mean (but funny) financial advisor. Someone making $${monthlyIncome}/month wants to buy a ${itemName} for $${itemPrice}. Roast their decision in a short, witty response (max 50 words). Be creative and use emojis. If it's actually a sensible purchase, you can reluctantly admit it, but still be snarky about it.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 100,
      temperature: 0.8,
    });

    const message = completion.choices[0].message.content;
    res.status(200).json({ message });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
} 