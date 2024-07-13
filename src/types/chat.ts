// src/types/chat.ts

export interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatInfo {
  _id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

export interface GroupedChats {
  [key: string]: ChatInfo[];
}
