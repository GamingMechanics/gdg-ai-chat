'use client';

import { useState } from 'react';
import { Message } from '@/types/chat';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    let accumulatedResponse = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          chatId: chatId 
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      // Get and store the chat ID from the response headers
      const newChatId = response.headers.get('X-Chat-Id');
      if (newChatId && !chatId) {
        setChatId(newChatId);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        accumulatedResponse += chunk;
        
        // Update UI with current accumulated response
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: accumulatedResponse
          };
          return [...prev.slice(0, -1), updatedMessage];
        });
      }

      // Set final message with complete response
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        const finalMessage = {
          ...lastMessage,
          content: accumulatedResponse
        };
        return [...prev.slice(0, -1), finalMessage];
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="flex-1 mb-4 border rounded-lg p-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
            <div className={`p-3 rounded-lg inline-block max-w-[80%] ${
              msg.role === 'user' ? 'bg-gray-100' : 'bg-blue-100'
            }`}>
              <p className="text-sm text-gray-800">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
