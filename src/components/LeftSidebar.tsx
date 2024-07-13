// src/components/LeftSidebar.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { signOut } from 'next-auth/react';

interface ChatInfo {
  _id: string;
  title: string;
  createdAt: string;
}

interface GroupedChats {
  [key: string]: ChatInfo[];
}

interface LeftSidebarProps {
  onChatSelect: (chatId: string) => void;
  currentChatId: string | null;
  groupedChats: GroupedChats;
  onNewChat: () => Promise<void>;
}

export default function LeftSidebar({ onChatSelect, currentChatId, groupedChats, onNewChat }: LeftSidebarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewChat = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onNewChat();
    } catch (error) {
      console.error('Error creating new chat:', error);
      setError('Failed to create new chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const chatGroups = ['Today', 'Yesterday', 'Previous 7 Days', 'Previous 30 Days'];
  
  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gradient-to-b from-gray-900 to-black p-3 flex flex-col"
    >
      <h1 className="text-4xl font-bold mb-8 flex items-center text-white">
        <span className="mr-2">🤖</span> ChatBot
      </h1>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNewChat}
        disabled={isLoading}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center mb-6 transition duration-300 shadow-lg disabled:opacity-50"
      >
        <PlusIcon className="h-5 w-5 mr-2" /> New Chat
      </motion.button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex-grow overflow-y-auto">
        {chatGroups.map((groupName) => (
          <div key={groupName} className="mb-4">
            <h2 className="text-sm font-semibold text-gray-400 mb-2">{groupName}</h2>
            {groupedChats[groupName] && groupedChats[groupName].length > 0 ? (
              groupedChats[groupName].map((chat) => (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg mb-2 truncate cursor-pointer ${
                    currentChatId === chat._id ? 'bg-purple-600 ring-2 ring-purple-400' : ''
                  }`}
                  onClick={() => onChatSelect(chat._id)}
                >
                  {chat.title}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 italic">No chats</p>
            )}
          </div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg flex items-center justify-center"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" /> Logout
      </motion.button>
    </motion.div>
  );
}