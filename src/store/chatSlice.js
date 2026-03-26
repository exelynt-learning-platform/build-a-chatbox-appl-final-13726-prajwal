import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";

const API_URL = "https://api.openai.com/v1/chat/completions";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (userContent, { getState, rejectWithValue }) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const model = import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo";

    if (!apiKey) {
      return rejectWithValue(
        "Missing API key. Add VITE_OPENAI_API_KEY to your .env file."
      );
    }

    const { messages } = getState().chat;
    const payloadMessages = [
      ...messages.map(({ role, content }) => ({ role, content })),
      { role: "user", content: userContent }
    ];

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: payloadMessages
        })
      });

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error?.message || errorMessage;
        } catch (parseError) {
          // Ignore JSON parse errors
        }
        return rejectWithValue(errorMessage);
      }

      const data = await response.json();
      const assistantMessage = data?.choices?.[0]?.message?.content?.trim();

      if (!assistantMessage) {
        return rejectWithValue("No response returned by the model.");
      }

      return assistantMessage;
    } catch (error) {
      return rejectWithValue(error?.message || "Network error.");
    }
  }
);

const initialState = {
  messages: [
    {
      id: nanoid(),
      role: "assistant",
      content: "Hi! I am your AI assistant. How can I help today?",
      timestamp: new Date().toISOString()
    }
  ],
  loading: false,
  error: null
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.messages.push({
          id: nanoid(),
          role: "user",
          content: action.meta.arg,
          timestamp: new Date().toISOString()
        });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: nanoid(),
          role: "assistant",
          content: action.payload,
          timestamp: new Date().toISOString()
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      });
  }
});

export const { clearError } = chatSlice.actions;
export default chatSlice.reducer;
