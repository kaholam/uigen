import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay, getToolLabel } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

// --- getToolLabel unit tests ---

test("getToolLabel: str_replace_editor create", () => {
  expect(getToolLabel({ state: "call", toolCallId: "1", toolName: "str_replace_editor", args: { command: "create", path: "src/components/Card.tsx" } })).toBe("Creating Card.tsx");
});

test("getToolLabel: str_replace_editor str_replace", () => {
  expect(getToolLabel({ state: "call", toolCallId: "1", toolName: "str_replace_editor", args: { command: "str_replace", path: "src/App.tsx" } })).toBe("Editing App.tsx");
});

test("getToolLabel: str_replace_editor insert", () => {
  expect(getToolLabel({ state: "call", toolCallId: "1", toolName: "str_replace_editor", args: { command: "insert", path: "src/App.tsx" } })).toBe("Editing App.tsx");
});

test("getToolLabel: str_replace_editor undo_edit", () => {
  expect(getToolLabel({ state: "call", toolCallId: "1", toolName: "str_replace_editor", args: { command: "undo_edit", path: "src/App.tsx" } })).toBe("Editing App.tsx");
});

test("getToolLabel: str_replace_editor view", () => {
  expect(getToolLabel({ state: "call", toolCallId: "1", toolName: "str_replace_editor", args: { command: "view", path: "src/index.ts" } })).toBe("Viewing index.ts");
});

test("getToolLabel: file_manager delete", () => {
  expect(getToolLabel({ state: "call", toolCallId: "1", toolName: "file_manager", args: { command: "delete", path: "src/Old.tsx" } })).toBe("Deleting Old.tsx");
});

test("getToolLabel: file_manager rename", () => {
  expect(getToolLabel({ state: "call", toolCallId: "1", toolName: "file_manager", args: { command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" } })).toBe("Renaming Old.tsx to New.tsx");
});

test("getToolLabel: unknown tool falls back to toolName", () => {
  expect(getToolLabel({ state: "call", toolCallId: "1", toolName: "some_other_tool", args: {} })).toBe("some_other_tool");
});

// --- ToolInvocationDisplay render tests ---

test("shows spinner when state is call", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{ state: "call", toolCallId: "1", toolName: "str_replace_editor", args: { command: "create", path: "src/Card.tsx" } }}
    />
  );
  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
  expect(document.querySelector(".animate-spin")).toBeDefined();
  expect(document.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows spinner when state is partial-call", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{ state: "partial-call", toolCallId: "1", toolName: "str_replace_editor", args: { command: "create", path: "src/Card.tsx" } }}
    />
  );
  expect(document.querySelector(".animate-spin")).toBeDefined();
  expect(document.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows green dot when state is result", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{ state: "result", toolCallId: "1", toolName: "str_replace_editor", args: { command: "create", path: "src/Card.tsx" }, result: "ok" }}
    />
  );
  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
  expect(document.querySelector(".bg-emerald-500")).toBeDefined();
  expect(document.querySelector(".animate-spin")).toBeNull();
});
