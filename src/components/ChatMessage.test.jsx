import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ChatMessage from "./ChatMessage";

describe("ChatMessage", () => {
  it("renders user message with label", () => {
    render(<ChatMessage message={{ role: "user", content: "Hello" }} />);

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(document.querySelector(".message-row.user")).not.toBeNull();
  });

  it("renders assistant message with label", () => {
    render(
      <ChatMessage message={{ role: "assistant", content: "Hi there" }} />
    );

    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
    expect(document.querySelector(".message-row.assistant")).not.toBeNull();
  });
});
