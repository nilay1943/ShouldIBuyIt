# Should I Buy It? 🤔

A web application that helps you decide whether you should make a purchase or not, powered by ChatGPT's witty financial advice and sassy responses. Built with Next.js, Chakra UI, and OpenAI's GPT-3.5.

## Features

- 💰 Dynamic money bag visualization based on income and purchase price
- 🔥 Animated money burning effect when spending money
- 💅 Modern UI with Chakra UI components
- 🤖 Sassy AI-powered financial advice
- 🌐 Secure API handling through Cloudflare Workers

## Tech Stack

- **Frontend**: Next.js, Chakra UI, React Icons
- **API**: Cloudflare Workers
- **AI**: OpenAI GPT-3.5 Turbo
- **Styling**: Chakra UI + Custom CSS Animations

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/should-i-buy-it.git
cd should-i-buy-it
```

2. Install dependencies:
```bash
npm install
```

3. Set up Cloudflare Worker:
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Add your OpenAI API key to Cloudflare
wrangler secret put OPENAI_API_KEY

# Deploy the worker
wrangler deploy
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

The frontend can be deployed to any static hosting service (Vercel, GitHub Pages, etc.). The API is handled by Cloudflare Workers, so no additional backend deployment is needed.

### Frontend Deployment
```bash
npm run build
npm run export
```

### API Deployment
```bash
wrangler deploy
```

## Project Structure

- `pages/` - Next.js pages
  - `index.js` - Main application page
  - `_document.js` - Custom document for emoji favicon
- `worker.js` - Cloudflare Worker code for API handling
- `wrangler.toml` - Cloudflare Worker configuration

## Features Explanation

### Money Visualization
The app visualizes your monthly income as a pile of money bags. When you enter a purchase price, it shows the impact on your finances by:
- Calculating bags based on income using a logarithmic scale
- Burning away bags proportional to the purchase price
- Animating the transition with fire effects

### AI Financial Advice
The app uses GPT-3.5 to generate personalized, sassy financial advice based on:
- Your monthly income
- The item you want to buy
- The item's price

## Security

- OpenAI API key is securely stored in Cloudflare Workers' secrets
- No sensitive information is exposed in the frontend
- All API calls are handled through Cloudflare Workers

## Contributing

Feel free to submit issues and enhancement requests! 