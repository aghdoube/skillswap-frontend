import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL);

const ChatApp = ({ userId: propUserId }) => {
  const [userId, setUserId] = useState(
    () => propUserId || localStorage.getItem("userId")
  );
  const { receiverId: routeReceiverId } = useParams();
  const [receiverId, setReceiverId] = useState(() => routeReceiverId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [typingStatus, setTypingStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOnline, setIsOnline] = useState({});

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const normalizeDate = (dateValue) => {
    if (!dateValue) {
      return new Date().toISOString(); 
    }

    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return dateValue;
    }

    if (typeof dateValue === "number") {
      return new Date(dateValue).toISOString();
    }

    return new Date().toISOString();
  };

  useEffect(() => {
    if (propUserId && propUserId !== userId) {
      setUserId(propUserId);
    }
  }, [propUserId]);

  useEffect(() => {
    if (routeReceiverId && routeReceiverId !== receiverId) {
      setReceiverId(routeReceiverId);
    }
  }, [routeReceiverId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profiles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(res.data)) {
          const filteredUsers = res.data.filter((user) => user._id !== userId);
          setUsers(filteredUsers);

          const onlineStatus = {};
          filteredUsers.forEach((user) => {
            onlineStatus[user._id] = false;
          });
          setIsOnline(onlineStatus);
        } else {
          setError("Invalid response format received from server");
          console.error("Invalid response format:", res.data);
        }
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    socket.emit("userOnline", userId);

    socket.on("onlineUsers", (onlineUsers) => {
      setIsOnline((prev) => {
        const newStatus = { ...prev };
        for (const id in newStatus) {
          newStatus[id] = onlineUsers.includes(id);
        }
        return newStatus;
      });
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [userId]);

  useEffect(() => {
    if (!receiverId || !userId) return;

    socket.emit("joinRoom", userId);

    setTypingStatus(false);

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("authToken");
    
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          return;
        }
    
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const allMessages = Array.isArray(res.data) ? res.data : res.data.messages || [];
    
        const convo = allMessages.filter(
          (msg) =>
            (msg.sender._id === userId && msg.receiver._id === receiverId) ||
            (msg.sender._id === receiverId && msg.receiver._id === userId)
        );
    
        if (convo.length === 0) {
          setError("No messages yet. Say hello 👋");
        } else {
          setError(null); // clear error
          setMessages(convo);
    
          convo.forEach((message) => {
            if (
              message.receiver &&
              message.receiver._id === userId &&
              !message.read
            ) {
              markMessageAsRead(message._id);
            }
          });
    
          if (messageInputRef.current) {
            messageInputRef.current.focus();
          }
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again later.");
      }
    };
    

    const handleReceiveMessage = (message) => {
      if (
        (message.sender === receiverId && message.receiver === userId) ||
        (message.sender === userId && message.receiver === receiverId)
      ) {
        setMessages((prev) => {
          const isDuplicate = prev.some((msg) => {
            const senderId = msg.sender && msg.sender._id ? msg.sender._id : msg.sender;
            const incomingSenderId = message.sender && message.sender._id ? message.sender._id : message.sender;
            
            return msg.text === message.text && 
                  senderId === incomingSenderId &&
                  new Date(msg.createdAt).getTime() > Date.now() - 5000; 
          });
          
          if (isDuplicate) {
            return prev;
          }
          
          const normalizedMessage = {
            ...message,
            sender: message.sender && message.sender._id ? message.sender : { _id: message.sender },
            receiver: message.receiver && message.receiver._id ? message.receiver : { _id: message.receiver },
            createdAt: normalizeDate(message.createdAt)
          };
          
          return [...prev, normalizedMessage];
        });
    
        if (message.receiver === userId && !message.read) {
          markMessageAsRead(message._id);
        }
      }
    };

    const handleTypingStatus = (data) => {
      if (data.sender === receiverId && data.receiver === userId) {
        setTypingStatus(data.isTyping);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("typingStatus", handleTypingStatus);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typingStatus", handleTypingStatus);
    };
  }, [receiverId, userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !receiverId) return;
  
    try {
      const token = localStorage.getItem("authToken");
      const messageText = newMessage.trim();
      
      setNewMessage("");
      
      handleTypingStop();
  
      const currentTime = new Date().toISOString();
      
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        sender: { _id: userId },
        receiver: { _id: receiverId },
        text: messageText,
        read: false,
        createdAt: currentTime,
        isTemp: true 
      };
      
      setMessages(prev => [...prev, tempMessage]);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messages`,
        { receiver: receiverId, text: messageText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      

      setMessages((prev) => {
        return prev.map((msg) =>
          msg.isTemp && msg.text === messageText ? response.data : msg
        );
      });

      socket.emit("sendMessage", {
        _id: response.data._id,
        sender: userId,
        receiver: receiverId,
        text: messageText,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error sending message:", err);

      setMessages((prev) => prev.filter((msg) => !msg.isTemp));
      alert("Failed to send message. Please try again.");
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/messages/read/${messageId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );

      socket.emit("markAsRead", messageId);
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", {
      sender: userId,
      receiver: receiverId,
      isTyping: true,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(handleTypingStop, 2000);
  };

  const handleTypingStop = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit("typing", {
      sender: userId,
      receiver: receiverId,
      isTyping: false,
    });
  };

  const getSelectedUserName = () => {
    const selectedUser = users.find((user) => user._id === receiverId);
    return selectedUser ? selectedUser.name : "Selected User";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMessageDate = (dateStr) => {
    try {
      const messageDate = new Date(dateStr);
      
      if (isNaN(messageDate.getTime())) {
        console.warn("Invalid date encountered:", dateStr);
        return "Recent";
      }
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (messageDate.toDateString() === today.toDateString()) {
        return "Today";
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return messageDate.toLocaleDateString(undefined, {
          year: 'numeric', 
          month: 'short', 
          day: 'numeric'
        });
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Recent";
    }
  };

  const groupedMessages = messages.reduce((groups, message) => {
    if (!message.createdAt) {
      const date = "Recent";
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }
  
    const date = formatMessageDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex h-screen font-sans bg-gray-100">
      <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
        <h3 className="text-xl font-semibold mb-4">Conversations</h3>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <p className="text-red-400 p-2 rounded-md bg-red-900/20">{error}</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-gray-400 text-center">No users found</p>
          ) : (
            <ul className="space-y-1">
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  onClick={() => setReceiverId(user._id)}
                  className={`cursor-pointer px-4 py-3 rounded-md transition-all flex items-center justify-between ${
                    receiverId === user._id
                      ? "bg-blue-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-lg font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                          isOnline[user._id] ? "bg-green-500" : "bg-gray-500"
                        } border-2 border-gray-800`}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">
                        {isOnline[user._id] ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {receiverId ? (
          <>
            <div className="p-4 border-b bg-white shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium text-gray-700">
                  {getSelectedUserName().charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-lg">
                    {getSelectedUserName()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isOnline[receiverId] ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="w-16 h-16 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <p className="text-center">No messages yet.</p>
                  <p className="text-center text-sm">
                    Say hello to start the conversation!
                  </p>
                </div>
              ) : (
                Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date} className="mb-6">
                    <div className="flex justify-center mb-4">
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                        {date}
                      </span>
                    </div>

                    {msgs.map((msg, index) => {
                      const senderId =
                        msg.sender && msg.sender._id
                          ? msg.sender._id
                          : typeof msg.sender === "string"
                          ? msg.sender
                          : undefined;
                      const isCurrentUser = senderId === userId;
                      const prevMsg = index > 0 ? msgs[index - 1] : null;
                      const prevSenderId = prevMsg
                        ? prevMsg.sender && prevMsg.sender._id
                          ? prevMsg.sender._id
                          : typeof prevMsg.sender === "string"
                          ? prevMsg.sender
                          : undefined
                        : null;
                      const showAvatar = !prevMsg || prevSenderId !== senderId;

                      return (
                        <div
                          key={msg._id || index}
                          className={`mb-2 flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          {!isCurrentUser && showAvatar && (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium mr-2 flex-shrink-0">
                              {getSelectedUserName().charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div
                            className={`px-4 py-2 rounded-lg max-w-xs break-words text-sm ${
                              isCurrentUser
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-white text-gray-800 shadow rounded-bl-none"
                            } ${msg.isTemp ? "opacity-70" : ""}`}
                          >
                            {msg.text}
                            <div className="text-[10px] text-right mt-1 flex justify-end items-center gap-1">
                              <span
                                className={
                                  isCurrentUser
                                    ? "text-blue-100"
                                    : "text-gray-400"
                                }
                              >
                                {msg.createdAt &&
                                !isNaN(new Date(msg.createdAt).getTime())
                                  ? new Date(msg.createdAt).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )
                                  : "Just now"}
                              </span>
                              {isCurrentUser && msg.read && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}

              {typingStatus && (
                <div className="flex items-center mt-2 ml-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium mr-2">
                    {getSelectedUserName().charAt(0).toUpperCase()}
                  </div>
                  <div className="bg-gray-200 px-3 py-2 rounded-lg inline-flex">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "200ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "400ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex items-center">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSendMessage()
                  }
                  onBlur={handleTypingStop}
                  placeholder="Type a message"
                  className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`ml-3 px-5 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors ${
                    !newMessage.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500 p-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p className="text-center text-gray-500 mb-4">
              Select a conversation from the sidebar to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
