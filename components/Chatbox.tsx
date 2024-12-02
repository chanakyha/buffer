"use client";
import { useState, useRef, KeyboardEvent } from 'react';

const Chatbox = () => {
  const [messages, setMessages] = useState<Array<{
    id: number,
    user: string,
    content: string,
    timestamp: string,
    replyTo?: number
  }>>([]);
  const [message, setMessage] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Example user list - replace with your actual user data
  const users = ['user1', 'user2', 'user3', 'user4', 'bot'];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        user: 'User', // Replace with actual user name
        content: message,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Auto scroll to bottom
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Get cursor position
    const position = e.target.selectionStart || 0;
    setCursorPosition(position);
    
    // Check if we should show user list
    const lastAtSymbol = value.lastIndexOf('@', position);
    if (lastAtSymbol !== -1) {
      const afterAtSymbol = value.slice(lastAtSymbol + 1, position);
      // Show list if we're right after @ or typing a username
      setShowUserList(!afterAtSymbol.includes(' '));
    } else {
      setShowUserList(false);
    }
  };

  const insertMention = (username: string) => {
    const lastAtSymbol = message.lastIndexOf('@', cursorPosition);
    const newMessage = 
      message.slice(0, lastAtSymbol) + 
      '@' + username + ' ' + 
      message.slice(cursorPosition);
    
    setMessage(newMessage);
    setShowUserList(false);
  };

  // Add this helper function to check if user exists
  const isValidUser = (username: string) => {
    return users.includes(username.replace('@', ''));
  };

  // Add this helper function to check for bot mention
  const isBotMentioned = (text: string): boolean => {
    return text.includes('@bot');
  };

  return (
    <div className="flex flex-col h-full rounded-lg">
      <div className='bg-[#323232] w-full h-14 flex justify-center items-center border-2 border-[#0054FF] rounded-t-lg'>
        <h1 className='text-xl font-semibold bg-[#323232] text-[#D9D9D9]'>Live Chat</h1>
      </div>
      {/* Chat messages container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#202020]"
      >
        {messages.map((message) => (
          <div key={message.id} className={`bg-gray-800 rounded p-2 ${message.replyTo ? 'ml-4 border-l-2 border-blue-500' : ''}`}>
            {message.replyTo && (
              <div className="text-sm text-gray-400 mb-1">
                Replying to: {messages.find(m => m.id === message.replyTo)?.content.substring(0, 50)}...
              </div>
            )}
            <div className="flex items-start">
              <span className="text-blue-400 font-bold mr-2">{message.user}:</span>
              <p className="text-white">
                {message.content.split(/(@\w+)/).map((part, index) => (
                  part.startsWith('@') ? 
                    <span key={index} className={
                      part === '@bot' ? "text-red-400 font-semibold" :
                      isValidUser(part) ? "text-blue-400 font-semibold" : 
                      "text-white"
                    }>
                      {part}
                    </span> : 
                    <span key={index}>{part}</span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="bg-[#202020] p-4 rounded-b-lg">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type @ to mention users..."
            className="flex-1 bg-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[#00ACFF] rounded-full"
          />
          {showUserList && (
            <div className="absolute bottom-full mb-1 w-full bg-gray-700 rounded shadow-lg max-h-40 overflow-y-auto">
              {users
                .filter(user => 
                  message
                    .slice(message.lastIndexOf('@', cursorPosition) + 1, cursorPosition)
                    .toLowerCase()
                    .split(' ')[0] === '' ||
                  user.toLowerCase().includes(
                    message
                      .slice(message.lastIndexOf('@', cursorPosition) + 1, cursorPosition)
                      .toLowerCase()
                  )
                )
                .map(user => (
                  <div
                    key={user}
                    className="p-2 hover:bg-gray-600 cursor-pointer"
                    onClick={() => insertMention(user)}
                  >
                    @{user}
                  </div>
                ))}
            </div>
          )}
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
          >
            {isBotMentioned(message) ? 'Crypto' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
