"use client";

// React
import { useRef, useState } from "react";

// AI (server)
import { getChatResponse } from "@/ai/ai";

// Chat Config
import { chatFirstMessage, CONFIG } from "@/common/config";

// Shad/cn Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Markdown
import showdown from "showdown";

// Icons
import { AlertCircle, Bot, Send, User } from "lucide-react";

// Types
import { ChatItem } from "@/common/types";

// Default
const defaultChats: ChatItem[] = [
  {
    message: chatFirstMessage,
    source: "bot",
  },
];

export default function Home() {
  // Refs
  const inputRef = useRef<HTMLInputElement | null>(null);

  // States
  const [message, setMessage] = useState<string>("");
  const [chats, setChats] = useState<ChatItem[]>(defaultChats);

  // Functions
  const handleChatSubmission = async () => {
    if (inputRef.current != null) {
      inputRef.current.value = "";
    }
    setChats([...chats, { message: message, source: "user" }]);
    const resp = await getChatResponse(chats, message);
    setChats([
      ...chats,
      { message: message, source: "user" },
      { message: resp, source: "bot" },
    ]);
  };

  const handleRestartChat = () => setChats(defaultChats);

  const convertMarkdownToHTML = (text: string) => {
    const converter = new showdown.Converter({
      tables: true,
      emoji: true,
      ghCodeBlocks: true,
      openLinksInNewWindow: true,
      strikethrough: true,
      underline: true,
    });
    console.log(converter.makeHtml(text));
    return converter.makeHtml(text);
  };

  return (
    <div className="max-w-5xl mx-auto md:px-8 min-h-screen flex flex-col gap-4">
      {/* Header */}
      <div className="top-0 sticky py-4 pb-2 bg-white px-4 flex justify-between items-center ">
        <h4 className="text-2xl font-semibold flex gap-2 items-center">
          <Bot className="h-8 w-8" />
          {CONFIG.CHATBOT_NAME}
        </h4>

        <Button size="sm" variant="outline" onClick={handleRestartChat}>
          <AlertCircle />
          <span>Restart Chat</span>
        </Button>
      </div>

      {/* Main Chat Component */}
      <div className="flex-1 flex flex-col gap-4 p-4">
        {chats.map((chatItem, index) => (
          <div
            className={`flex flex-col gap-1 ${
              chatItem.source === "user" ? "items-end" : "items-start"
            }`}
            key={`chat-${index}`}
          >
            <div className="flex gap-2 items-center font-mono text-gray-700 text-sm font-semibold">
              {chatItem.source === "bot" ? (
                <>
                  <Bot className="h-5 w-5 text-green-500" />
                  <span>Bot</span>
                </>
              ) : (
                <>
                  <User className="h-5 w-5 text-blue-500" />
                  <span>User</span>
                </>
              )}
            </div>
            <div
              className={`prose lg:prose-md max-w-[95%] md:max-w-[85%] p-3 rounded-lg shadow-sm ${
                chatItem.source === "user"
                  ? "bg-blue-50 text-gray-800 text-right"
                  : "bg-green-50 text-gray-800 text-left "
              }`}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: convertMarkdownToHTML(chatItem.message),
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="sticky bottom-0 bg-white py-4 px-2 flex gap-1">
        <Input
          placeholder="Enter your message..."
          onChange={(e) => setMessage(e.target.value)}
          ref={inputRef}
        />

        <Button className="my-auto" size="sm" onClick={handleChatSubmission}>
          <Send />
        </Button>
      </div>
    </div>
  );
}
