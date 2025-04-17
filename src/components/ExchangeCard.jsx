import React from "react";

const ExchangeCard = ({
  exchange,
  onAccept,
  onDecline,
  onOpenChat,
  getReceiverId,
}) => {
  const currentUserId = localStorage.getItem("userId");
  const receiverId = getReceiverId(exchange);
  const otherUser =
    exchange.provider._id === currentUserId
      ? exchange.requester.name
      : exchange.provider.name;

  return (
    <div className="border rounded p-4 mb-3 shadow-sm">
      <p><strong>Skill:</strong> {exchange.skill}</p>
      <p><strong>With:</strong> {otherUser}</p>
      <p><strong>Status:</strong> {exchange.status}</p>

      <div className="mt-2 flex gap-2">
        {exchange.status === "Pending" && (
          <>
            <button
              onClick={() => onAccept(exchange._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Accept
            </button>
            <button
              onClick={() => onDecline(exchange._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Decline
            </button>
          </>
        )}
        <button
          onClick={() => onOpenChat(receiverId)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Open Chat
        </button>
      </div>
    </div>
  );
};

export default ExchangeCard;
