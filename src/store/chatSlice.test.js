import { describe, expect, it } from "vitest";
import reducer, { clearError, sendMessage } from "./chatSlice";

const getInitialState = () => reducer(undefined, { type: "@@init" });

describe("chatSlice", () => {
  it("seeds an initial assistant message", () => {
    const state = getInitialState();
    expect(state.messages.length).toBe(1);
    expect(state.messages[0].role).toBe("assistant");
    expect(state.messages[0].content).toContain("AI assistant");
  });

  it("clears errors", () => {
    const state = { ...getInitialState(), error: "Something broke" };
    const next = reducer(state, clearError());
    expect(next.error).toBeNull();
  });

  it("handles sendMessage.pending", () => {
    const state = getInitialState();
    const next = reducer(state, sendMessage.pending("req-1", "Hello"));
    expect(next.loading).toBe(true);
    expect(next.error).toBeNull();
    expect(next.messages[next.messages.length - 1]).toMatchObject({
      role: "user",
      content: "Hello"
    });
  });

  it("handles sendMessage.fulfilled", () => {
    const state = getInitialState();
    const pending = reducer(state, sendMessage.pending("req-2", "Hi"));
    const next = reducer(
      pending,
      sendMessage.fulfilled("Hello there!", "req-2", "Hi")
    );
    expect(next.loading).toBe(false);
    expect(next.messages[next.messages.length - 1]).toMatchObject({
      role: "assistant",
      content: "Hello there!"
    });
  });

  it("handles sendMessage.rejected", () => {
    const state = getInitialState();
    const pending = reducer(state, sendMessage.pending("req-3", "Hi"));
    const next = reducer(
      pending,
      sendMessage.rejected(new Error("boom"), "req-3", "Hi", "Bad key")
    );
    expect(next.loading).toBe(false);
    expect(next.error).toBe("Bad key");
  });
});
