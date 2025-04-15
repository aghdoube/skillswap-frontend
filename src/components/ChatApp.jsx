import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

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

  const messagesEndRef = useRef(null);

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

        const res = await axios.get("http://localhost:5000/api/auth/profiles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(res.data)) {
          const filteredUsers = res.data.filter((user) => user._id !== userId);
          setUsers(filteredUsers);
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
  }, [userId]);

  useEffect(() => {
    if (!receiverId || !userId) return;

    socket.emit("joinRoom", userId);

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication token not found. Please log in again.");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const convo = res.data.filter(
          (msg) =>
            (msg.sender._id === userId && msg.receiver._id === receiverId) ||
            (msg.sender._id === receiverId && msg.receiver._id === userId)
        );

        setMessages(convo);

        convo.forEach((message) => {
          if (message.receiver._id === userId && !message.read) {
            markMessageAsRead(message._id);
          }
        });
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    socket.on("receiveMessage", (message) => {
      if (
        (message.sender === receiverId && message.receiver === userId) ||
        (message.sender === userId && message.receiver === receiverId)
      ) {
        setMessages((prev) => [...prev, message]);
  
        if (message.receiver === userId && !message.read) {
          markMessageAsRead(message._id);
        }
      }
    });
  
    return () => {
      socket.off("receiveMessage");
    };
  }, [receiverId, userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !receiverId) return;

    try {
      const token = localStorage.getItem("authToken");

      await axios.post(
        "http://localhost:5000/api/messages",
        { receiver: receiverId, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit("sendMessage", {
        sender: userId,
        receiver: receiverId,
        text: newMessage,
      });

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:5000/api/messages/read/${messageId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      socket.emit("markAsRead", messageId);
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const getSelectedUserName = () => {
    const selectedUser = users.find((user) => user._id === receiverId);
    return selectedUser ? selectedUser.name : "Selected User";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen font-sans bg-gray-100">
      <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Users</h3>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : users.length === 0 ? (
          <p>No users available</p>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user._id}
                onClick={() => setReceiverId(user._id)}
                className={`cursor-pointer px-4 py-2 rounded-md ${
                  receiverId === user._id ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                {user.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {receiverId ? (
          <>
            <div className="p-4 border-b bg-gray-100 font-semibold text-lg">
              {getSelectedUserName()}
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-200">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">
                  No messages yet. Start a conversation!
                </p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 flex ${
                      msg.sender._id === userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-xs break-words text-sm ${
                        msg.sender._id === userId
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800 shadow"
                      }`}
                    >
                      {msg.text}
                      <div className="text-[10px] text-right text-gray-400 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {msg.sender._id === userId && msg.read && " ✓"}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center p-4 border-t bg-gray-100">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message"
                className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSendMessage}
                className="ml-3 px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 text-lg">
            Select a user to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
