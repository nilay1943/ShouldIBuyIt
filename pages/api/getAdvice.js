export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const { monthlyIncome, itemName, itemPrice } = await req.json();

    const prompt = `You're a sassy, slightly mean (but funny) financial advisor. Someone making $${monthlyIncome}/month wants to buy a ${itemName} for $${itemPrice}. Roast their decision in a short, witty response (max 50 words). Be creative and use emojis. If it's actually a sensible purchase, you can reluctantly admit it, but still be snarky about it.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.8,
      })
    });

    const completion = await response.json();
    const message = completion.choices[0].message.content;

    return new Response(JSON.stringify({ message }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Error processing your request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 