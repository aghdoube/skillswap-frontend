import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";


import { useNavigate, useLocation } from "react-router-dom";
import ExchangeCard from "../components/ExchangeCard";
import StartExchange from "../components/StartExchange";

const ExchangeList = () => {
  const [exchanges, setExchanges] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
  });

  const getReceiverId = (exchange) => {
    const currentUserId = localStorage.getItem("userId");
    return exchange.provider._id === currentUserId
      ? exchange.requester._id
      : exchange.provider._id;
  };

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const res = await api.get("/api/exchanges", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        console.log("API response:", res.data);

        if (Array.isArray(res.data)) {
          setExchanges(res.data);
        } else if (res.data && typeof res.data === "object") {
          setExchanges(Array.isArray(res.data.exchanges) ? res.data.exchanges : []);
        } else {
          setExchanges([]);
        }
      } catch (err) {
        console.error("Failed to load exchanges:", err);
        setExchanges([]);
      }
    };

    fetchExchanges();
  }, []);

  const handleOpenChat = (receiverId) => {
    navigate(`/messages/${receiverId}`);
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleAccept = async (exchangeId) => {
    try {
      await api.put(
        `/api/exchanges/${exchangeId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Accept failed:", error);
    }
  };

  const handleDecline = async (exchangeId) => {
    try {
      await api.put(
        `/api/exchanges/${exchangeId}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      window.location.reload();
       
    } catch (error) {
      console.error("Decline failed:", error);
    }
  };

  return (
    <div className="container p-4">

<div className="w-full flex items-center mb-6">
     <button
  onClick={handleGoBack}
  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-700 rounded-md transition-colors duration-150"
>
  <span className="text-base">←</span>
  <span>Back to Dashboard</span>
</button>

</div>
<h2 className="text-4xl font-extrabold mb-6 text-gray-800 text-center mt-16">
  My Exchanges
</h2>
      <StartExchange userId={userId} />

      {!Array.isArray(exchanges) && <p>Loading exchanges...</p>}
      {Array.isArray(exchanges) && exchanges.length === 0 && <p>No exchanges yet.</p>}
      {Array.isArray(exchanges) &&
        exchanges.length > 0 &&
        exchanges.map((exchange) => (
          <ExchangeCard
            key={exchange._id}
            exchange={exchange}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onOpenChat={handleOpenChat}
            getReceiverId={getReceiverId}
          />
        ))}
    </div>
  );
};

export default ExchangeList;
