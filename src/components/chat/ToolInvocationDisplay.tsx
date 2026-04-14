"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "@ai-sdk/ui-utils";

interface ToolInvocationDisplayProps {
  toolInvocation: ToolInvocation;
}

export function getToolLabel(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const filename = args?.path ? args.path.split("/").pop() : null;

  if (toolName === "str_replace_editor" && filename) {
    switch (args.command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
      case "undo_edit":
        return `Editing ${filename}`;
      case "view":
        return `Viewing ${filename}`;
    }
  }

  if (toolName === "file_manager" && filename) {
    switch (args.command) {
      case "delete":
        return `Deleting ${filename}`;
      case "rename": {
        const newFilename = args.new_path ? args.new_path.split("/").pop() : filename;
        return `Renaming ${filename} to ${newFilename}`;
      }
    }
  }

  return toolName;
}

export function ToolInvocationDisplay({ toolInvocation }: ToolInvocationDisplayProps) {
  const label = getToolLabel(toolInvocation);
  const isDone = toolInvocation.state === "result" && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
