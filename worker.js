// Handle CORS preflight requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function handleRequest(request) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { monthlyIncome, itemName, itemPrice } = await request.json();

    const prompt = `You're a sassy, slightly mean (but funny), financial advisor. Someone making $${monthlyIncome}/month wants to buy a ${itemName} for $${itemPrice}. Comment on their decision in a short, witty response (max 50 words). Be creative and use emojis. If it's actually a sensible purchase, you can reluctantly admit it, but still be snarky about it.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const message = data.choices[0].message.content;

    return new Response(JSON.stringify({ message }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
}); 