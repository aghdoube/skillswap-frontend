import React, { useEffect, useState } from "react";
import axios from "axios";
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
      <h2 className="text-xl font-bold mb-4">My Exchanges</h2>
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
