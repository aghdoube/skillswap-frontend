import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io(import.meta.env.VITE_API_URL);

const SimpleChat = () => {
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profiles`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(res.data.filter((user) => user._id !== userId)); 
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [userId]);

  useEffect(() => {
    if (!receiverId || !userId) return; 

const fetchMessages = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/messages`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { receiverId },
      }
    );

    console.log("📥 Backend response message:", res.data);

    const allMessages = res.data || [];
    
    const uniqueMessages = allMessages.reduce((acc, message) => {
      if (!acc.some(m => m._id === message._id)) {
        acc.push(message);
      }
      return acc;
    }, []);
    
    console.log("📦 Unique messages:", uniqueMessages);

    const convo = uniqueMessages.filter((msg) => {
      return (
        (msg.sender._id.toString() === userId &&
          msg.receiver._id.toString() === receiverId) ||
        (msg.sender._id.toString() === receiverId &&
          msg.receiver._id.toString() === userId)
      );
    });

    console.log("📦 Filtered messages:", convo);

    setMessages(convo);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

    fetchMessages();
  }, [receiverId, userId]);

useEffect(() => {
  if (!receiverId || !userId) return;

  const handleReceiveMessage = (message) => {
    if (message.sender !== userId && 
        [message.sender, message.receiver].includes(receiverId)) {
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg._id === message._id)) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    }
  };

  socket.on("receiveMessage", handleReceiveMessage);

  return () => socket.off("receiveMessage", handleReceiveMessage);
}, [receiverId, userId]);

const sendMessage = async () => {
  if (!newMessage.trim() || !receiverId) return;

  const messageData = {
    sender: userId,
    receiver: receiverId,
    text: newMessage.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/messages`,
      messageData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const savedMessage = response.data;

    socket.emit("sendMessage", savedMessage);

    setMessages((prev) => [...prev, savedMessage]);
    
    setNewMessage("");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white border-r p-4">
  <h3 className="text-lg font-semibold mb-4">Chats</h3>
  {users.map((user) => (
    <div
      key={user._id}
      onClick={() => setReceiverId(user._id)}
      className={`p-3 cursor-pointer rounded mb-2 flex items-center gap-2 ${receiverId === user._id ? "bg-blue-100" : "hover:bg-gray-100"}`}
    >
      <img
        src={user.profilePic || "/path/to/default/profile.jpg"} 
        alt={user.name}
        className="w-8 h-8 rounded-full object-cover"
      />
      <span>{user.name}</span>
    </div>
  ))}
</div>


      <div className="flex-1 flex flex-col">
        {receiverId ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
{messages.map((msg, i) => {
  const isSentByCurrentUser = msg.sender && msg.sender._id === userId;
  
  return (
    <div
      key={i}
      className={`mb-3 flex ${
        isSentByCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isSentByCurrentUser
            ? "bg-blue-500 text-white"
            : "bg-gray-300"
        }`}
      >
        <p>{msg.text}</p>
        <p
          className={`text-xs mt-1 ${
            isSentByCurrentUser
              ? "text-blue-100"
              : "text-gray-500"
          }`}
        >
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
})}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message"
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleChat;
