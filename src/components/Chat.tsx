// src/components/Chat.tsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatProps {
  currentChatId: string | null;
  onChatTitleUpdate: (chatId: string, newTitle: string) => void;
}

export default function Chat({ currentChatId, onChatTitleUpdate}: ChatProps) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (currentChatId) {
      fetchChatHistory(currentChatId);
    } else {
      setChatHistory([]);
    }
  }, [currentChatId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const fetchChatHistory = async (chatId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/chat/${chatId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      const data = await response.json();
      setChatHistory(data.messages || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setError('Failed to load chat history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading || !currentChatId) return;

    setIsLoading(true);
    setError(null);
    const newMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, newMessage]);
    setMessage('');

    try {
      const response = await fetch(`/api/chat/${currentChatId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.content }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from ChatGPT');
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);

      // Update chat title if it's the first message
      if (chatHistory.length === 0) {
        const titleResponse = await fetch(`/api/chat/${currentChatId}/title`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: message.slice(0, 150) }),
        });
        if (titleResponse.ok) {
          onChatTitleUpdate(currentChatId, message.slice(0, 150));
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentChatId) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-white text-xl">Select a chat or start a new one</p>
      </div>
    );
  }
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="h-full flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
  >
      <div ref={chatContainerRef} className="flex-1 p-3 overflow-y-auto">
        {chatHistory.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div className={`inline-block p-3 rounded-lg ${msg.role === 'user' ? 'bg-purple-600' : 'bg-blue-600'}`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="text-center py-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-6 h-6 border-t-2 border-blue-500 rounded-full"
            />
          </div>
        )}
      </div>
      {error && <p className="text-red-500 px-3 py-2">{error}</p>}
      <div className="p-3 border-t border-purple-700">
        <div className="flex items-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden shadow-lg">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-transparent text-white px-6 py-4 focus:outline-none placeholder-purple-300 resize-none"
            disabled={isLoading}
            rows={1}
            style={{ minHeight: '44px', maxHeight: '200px' }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full transition duration-300 mr-1 ${
              !message.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}