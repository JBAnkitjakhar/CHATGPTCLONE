 
// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { motion } from "framer-motion";
import LeftSidebar from "@/components/LeftSidebar";
import Chat from "@/components/Chat";
import RightSidebar from "@/components/RightSidebar";
import { useLoading } from "@/contexts/LoadingContext";
import { useUser } from "@/contexts/UserContext";
import { ChatInfo, GroupedChats } from "@/types/chat";

export default function Dashboard() {
  const [leftWidth, setLeftWidth] = useState(20);
  const [middleWidth, setMiddleWidth] = useState(60);
  const [rightWidth, setRightWidth] = useState(20);
  const { setIsLoading } = useLoading();
  const { username } = useUser();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [groupedChats, setGroupedChats] = useState<GroupedChats>({});
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chat');
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      const data = await response.json();
      const grouped = groupChatsByDate(data.chats);
      setGroupedChats(grouped);
    } catch (error) {
      console.error("Error loading chats:", error);
      setError("Failed to load chats. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const groupChatsByDate = useCallback((chats: ChatInfo[]): GroupedChats => {
    const grouped: GroupedChats = {
      "Today": [],
      "Yesterday": [],
      "Previous 7 Days": [],
      "Previous 30 Days": []
    };
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Calculate the start of yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  chats.forEach(chat => {
    const chatDate = new Date(chat.createdAt);
    
    if (chatDate >= now) {
      grouped["Today"].push(chat);
    } else if (chatDate >= yesterday) {
      grouped["Yesterday"].push(chat);
    } else if (chatDate >= new Date(now.setDate(now.getDate() - 7))) {
      grouped["Previous 7 Days"].push(chat);
    } else if (chatDate >= new Date(now.setDate(now.getDate() - 30))) {
      grouped["Previous 30 Days"].push(chat);
    }
  });

  return grouped;
}, []);

  const handleChatSelect = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  const handleNewChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chat/new', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to create new chat');
      }
      const data = await response.json();
      const newChat: ChatInfo = {
        _id: data.newChat._id,
        title: data.newChat.title,
        createdAt: new Date().toISOString(),// This ensures UTC time
        messages: []
      };
      setGroupedChats(prev => ({
        ...prev,
        "Today": [newChat, ...(prev["Today"] || [])]
      }));
      setCurrentChatId(newChat._id);
    } catch (error) {
      console.error("Error creating new chat:", error);
      setError("Failed to create new chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const handleChatTitleUpdate = useCallback((chatId: string, newTitle: string) => {
    setGroupedChats(prev => {
      const updated = { ...prev };
      for (const group in updated) {
        const chatIndex = updated[group].findIndex(chat => chat._id === chatId);
        if (chatIndex !== -1) {
          updated[group] = [
            ...updated[group].slice(0, chatIndex),
            { ...updated[group][chatIndex], title: newTitle },
            ...updated[group].slice(chatIndex + 1)
          ];
          break;
        }
      }
      return updated;
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-1.5"
    >
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          {error}
        </div>
      )}
      <PanelGroup direction="horizontal">
        <Panel defaultSize={leftWidth} minSize={15}>
          <LeftSidebar 
            onChatSelect={handleChatSelect} 
            currentChatId={currentChatId} 
            groupedChats={groupedChats}
            onNewChat={handleNewChat}
          />
        </Panel>
        <PanelResizeHandle className="w-1 bg-purple-700 hover:bg-purple-900 transition-colors" />
        <Panel defaultSize={middleWidth} minSize={30}>
          <Chat 
            currentChatId={currentChatId}
            onChatTitleUpdate={handleChatTitleUpdate}
          />
        </Panel>
        <PanelResizeHandle className="w-1 bg-purple-600 hover:bg-purple-900 transition-colors" />
        <Panel defaultSize={rightWidth} minSize={10}>
          <RightSidebar />
        </Panel>
      </PanelGroup>
    </motion.div>
  );
}