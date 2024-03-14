import React, { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [
      { text: 'Hi there! How can I assist you today?', sender: 'bot', timestamp: Date.now() }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [userNameFixed, setUserNameFixed] = useState(false);
  const [nameWarning, setNameWarning] = useState(false);
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setIsTyping(e.target.value !== '');
  };

  const handleSendMessage = () => {
    if (!userNameFixed) {
      setNameWarning(true);
      return;
    }

    if (input.trim() === '') return;

    const newUserMessage = { text: input, sender: 'user', timestamp: Date.now(), userName };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInput('');
    setIsTyping(false);
    localStorage.setItem('chatMessages', JSON.stringify([...messages, newUserMessage]));

    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { ...newUserMessage, sender: 'bot' }]);
      localStorage.setItem('chatMessages', JSON.stringify([...messages, { ...newUserMessage, sender: 'bot' }]));
      scrollToBottom();
    }, 500);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="text-center py-4">
        {!userNameFixed && (
          <>
            <input
              type="text"
              className="px-4 py-2 bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-300 text-white"
              placeholder="Enter your name..."
              value={userName}
              onChange={handleNameChange}
            />
            <button
              onClick={() => setUserNameFixed(true)}
              className="ml-2 p-2 rounded-full text-white bg-cyan-900 hover:bg-opacity-70 focus:outline-none"
            >
              User
            </button>
          </>
        )}
        {userNameFixed && (
          <div className="text-xl">{userName}</div>
        )}
        {nameWarning && (
          <p className="text-red-500 mt-2">Please add your name before starting the chat.</p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="max-w-3/4 mx-auto">
            {msg.sender === 'user' ? (
              <div className="text-right mb-2 animate-slidein">
                <div className="bg-blue-500 rounded-lg p-4 inline-block">
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-white mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="text-left mb-2 animate-slidein">
                <div className="bg-gray-800 rounded-lg p-4 inline-block">
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center px-4 py-2 bg-white bg-opacity-25">
        <input
          type="text"
          className="flex-grow px-4 py-2 mb-2 sm:mb-0 mr-0 sm:mr-2 bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-300 text-white"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          disabled={!userNameFixed}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 mb-2 sm:mb-0 text-white bg-gray-900 hover:bg-opacity-70 rounded-full focus:outline-none"
          disabled={!userNameFixed}
        >
          Send
        </button>
        <button
          onClick={handleClearChat}
          className="px-4 py-2 mb-2 sm:mb-0 ml-0 sm:ml-2 text-white bg-red-500 hover:bg-red-600 rounded-full focus:outline-none"
        >
          Clear Chat
        </button>
        {isTyping && <div className="ml-4 text-gray-400">Typing...</div>}
      </div>
    </div>
  );
};

export default ChatBot;
