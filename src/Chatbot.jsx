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
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setIsTyping(e.target.value !== '');
  };

  const handleSendMessage = () => {
    if (!userNameFixed) {
      setUserNameFixed(true);
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
    <div className="flex flex-col h-screen bg-black text-white relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
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
              className="ml-2 p-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              Add
            </button>
          </>
        )}
        {userNameFixed && (
          <div className="text-xl">{userName}</div>
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
      <div className="flex items-center justify-center px-4 py-2 bg-white bg-opacity-25">
        <input
          type="text"
          className="flex-grow px-4 py-2 mr-2 bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-300 text-white"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          disabled={!userNameFixed}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full focus:outline-none"
          disabled={!userNameFixed}
        >
          Send
        </button>
        <button
          onClick={handleClearChat}
          className="ml-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-full focus:outline-none"
        >
          Clear Chat
        </button>
        {isTyping && <div className="ml-4 text-gray-400">Typing...</div>}
      </div>
    </div>
  );
};

export default ChatBot;
