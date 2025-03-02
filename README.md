# Should I Buy It?

A web application that helps you decide whether you should make a purchase or not, powered by ChatGPT's witty financial advice.

## Features

- Input your monthly income
- Specify the item you want to buy and its price
- Get humorous and insightful advice from AI about your potential purchase

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Technologies Used

- Next.js
- React
- Chakra UI
- OpenAI API 