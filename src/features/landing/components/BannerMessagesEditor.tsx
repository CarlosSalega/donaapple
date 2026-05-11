"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

interface BannerMessagesEditorProps {
  value: string[];
  onChange: (messages: string[]) => void;
  maxItems?: number;
}

export function BannerMessagesEditor({
  value,
  onChange,
  maxItems = 5,
}: BannerMessagesEditorProps) {
  const messages = value.length > 0 ? value : [""];

  const handleChange = (index: number, text: string) => {
    const newMessages = [...messages];
    newMessages[index] = text;
    onChange(newMessages.filter((m) => m.trim() !== ""));
  };

  const handleAdd = () => {
    if (messages.length < maxItems) {
      onChange([...messages, ""]);
    }
  };

  const handleRemove = (index: number) => {
    const newMessages = messages.filter((_, i) => i !== index);
    onChange(newMessages.length > 0 ? newMessages : [""]);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {messages.map((message, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-muted-foreground w-6 text-sm">{index + 1}.</span>
            <Input
              placeholder={`Mensaje ${index + 1}`}
              value={message}
              onChange={(e) => handleChange(index, e.target.value)}
              className="flex-1"
            />
            {messages.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="h-8 w-8 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      {messages.length < maxItems && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Agregar mensaje
        </Button>
      )}
      <p className="text-muted-foreground text-xs">
        Máximo {maxItems} mensajes
      </p>
    </div>
  );
}
