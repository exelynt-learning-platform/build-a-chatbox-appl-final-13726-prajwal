# Chatbox Application with OpenAI API Integration (Redux)

A responsive chat UI built with React + Redux Toolkit. Users can send messages to OpenAI's Chat Completions API and receive real-time responses, with full loading and error state handling.

## Features
- Redux state management for messages, loading, and errors
- Async API calls via `createAsyncThunk`
- Left-aligned user messages, right-aligned AI responses
- Loading/typing indicator while awaiting response
- Responsive layout for desktop and mobile

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file from the example:
   ```bash
   copy .env.example .env
   ```
3. Add your OpenAI API key in `.env`:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_OPENAI_MODEL=gpt-3.5-turbo
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Notes
- The API key is loaded from environment variables and is not committed to the repo.
- For production use, proxy API requests through a backend to avoid exposing API keys in the browser.

## Testing (Vitest)
```bash
npm run test
```

