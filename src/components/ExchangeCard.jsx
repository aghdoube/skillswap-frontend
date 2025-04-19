import React from "react";

const ExchangeCard = ({
  exchange,
  onAccept,
  onDecline,
  onOpenChat,
  getReceiverId,
}) => {
  const currentUserId = localStorage.getItem("userId");

  let receiverId;
  try {
    if (typeof getReceiverId === 'function' && exchange) {
      receiverId = getReceiverId(exchange);
    } else {
      const { provider = {}, requester = {} } = exchange || {};
      receiverId = provider._id === currentUserId ? requester._id : provider._id;
    }
  } catch (error) {
    console.error("Error getting receiver ID:", error);
    receiverId = null;
  }

  const { 
    provider = {}, 
    requester = {}, 
    status = "Unknown", 
    skill = "Unknown Skill",
    createdAt = new Date().toISOString()
  } = exchange || {};

  const otherUser = provider._id === currentUserId ? requester : provider;
  const userName = otherUser?.name || "Unknown User";
  const userProfilePic = otherUser?.profilePic || null;

  const userInitial = userName.charAt(0).toUpperCase();

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const statusConfig = {
    Pending: { color: "bg-amber-100 text-amber-800", icon: "⏳" },
    Accepted: { color: "bg-green-100 text-green-800", icon: "✓" },
    Declined: { color: "bg-red-100 text-red-800", icon: "✕" },
    Cancelled: { color: "bg-red-200 text-red-800", icon: "❌" },
    Unknown: { color: "bg-gray-100 text-gray-800", icon: "?" }
  };

  const currentStatus = statusConfig[status] || statusConfig.Unknown;

  const handleAccept = () => {
    if (typeof onAccept === 'function' && exchange?._id) {
      onAccept(exchange._id);
    }
  };

  const handleDecline = () => {
    if (typeof onDecline === 'function' && exchange?._id) {
      onDecline(exchange._id);
    }
  };

  const handleOpenChat = () => {
    if (typeof onOpenChat === 'function' && receiverId) {
      onOpenChat(receiverId);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white bg-opacity-20 text-white font-medium shadow-md">
              {userProfilePic ? (
                <img
                  src={userProfilePic}
                  alt={`${userName}'s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.textContent = userInitial;
                  }}
                />
              ) : (
                userInitial
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{skill}</h2>
              <p className="text-indigo-100 text-sm">with {userName}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${currentStatus.color} shadow-sm`}>
            <span>{currentStatus.icon}</span>
            {status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-5 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center text-sm text-blue-700">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Created on {formattedDate}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {status === "Pending" && (
            <>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 mb-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-300 to-purple-400 hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 shadow-md"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Accept
              </button>

              <button
                onClick={handleDecline}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 mb-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-pink-400 to-purple-400 hover:bg-gray-200 transition-all duration-200 shadow-md"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Decline
              </button>
            </>
          )}

          <button
            onClick={handleOpenChat}
            className={`${status === "Pending" ? "" : "flex-1 sm:flex-none"} inline-flex items-center justify-center px-4 py-2 mb-2 rounded-lg text-sm font-medium ${status === "Pending" ? "text-gray-700 bg-gray-100 hover:bg-gray-200" : "text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"} transition-all duration-200 shadow-md`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat{status !== "Pending" ? ` with ${userName}` : ""}
          </button>

          {status === "Accepted" && (
            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeCard;
