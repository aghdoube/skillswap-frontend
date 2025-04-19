import React, { useEffect, useState } from "react";

function QandA() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    details: "",
    category: "",
    isAnonymous: false,
  });
  const [replies, setReplies] = useState({});
  const [showPostForm, setShowPostForm] = useState(false);

  const mockQuestions = [
    {
      _id: "1",
      title: "How to paint a room?",
      details: "I need tips on how to paint a room, especially for beginners.",
      category: "DIY",
      isAnonymous: false,
      createdAt: "2025-04-19T10:00:00Z",
      color: "bg-yellow-200",
      replies: [
        { text: "Start with preparing the room by covering furniture and floors." },
        { text: "Make sure to use painter's tape for clean lines around edges." }
      ]
    },
    {
      _id: "2",
      title: "How do I get rid of couch stench?",
      details: "My couch smells like mildew and I need help getting rid of it.",
      category: "Home",
      isAnonymous: false,
      createdAt: "2025-04-18T14:30:00Z",
      color: "bg-green-200",
      replies: [
        { text: "Try using a mixture of baking soda and vinegar to neutralize odors." },
        { text: "Use a fabric refresher spray after cleaning." }
      ]
    },
    {
      _id: "3",
      title: "What is adulting?",
      details: "Can someone explain what adulting really means? I'm still figuring it out.",
      category: "Adulting",
      isAnonymous: true,
      createdAt: "2025-04-17T16:00:00Z",
      color: "bg-pink-200",
      replies: [
        { text: "Adulting means taking responsibility for your life, like managing your finances and career." }
      ]
    },
    {
      _id: "4",
      title: "How to improve my credit score?",
      details: "I've been struggling with my credit score. Any advice?",
      category: "Life",
      isAnonymous: false,
      createdAt: "2025-04-15T11:00:00Z",
      color: "bg-blue-200",
      replies: [
        { text: "Start by paying off outstanding debts and making sure to pay bills on time." },
        { text: "Consider getting a secured credit card to build up your credit history." }
      ]
    },
    {
      _id: "5",
      title: "What should I pack for a camping trip?",
      details: "I'm planning a camping trip. What essentials should I pack?",
      category: "Life",
      isAnonymous: false,
      createdAt: "2025-04-14T08:30:00Z",
      color: "bg-yellow-200",
      replies: [
        { text: "Pack a tent, sleeping bag, first aid kit, flashlight, and food for the trip." },
        { text: "Don't forget a portable charger for your phone and a water filter or purification tablets." }
      ]
    },
    {
      _id: "6",
      title: "How do I start a vegetable garden?",
      details: "I want to grow my own vegetables. Any tips for beginners?",
      category: "Home",
      isAnonymous: true,
      createdAt: "2025-04-13T18:20:00Z",
      color: "bg-green-200",
      replies: [
        { text: "Start with easy-to-grow plants like tomatoes, lettuce, or radishes." },
        { text: "Ensure you have good soil, plenty of sunlight, and consistent watering." }
      ]
    },
    {
      _id: "7",
      title: "How do I know if I need therapy?",
      details: "I've been feeling down lately. Should I see a therapist?",
      category: "Life",
      isAnonymous: false,
      createdAt: "2025-04-12T13:50:00Z",
      color: "bg-blue-200",
      replies: [
        { text: "If you're feeling overwhelmed, persistently sad, or anxious, therapy might help." },
        { text: "It's always a good idea to talk to someone who can give you guidance and support." }
      ]
    },
    {
      _id: "8",
      title: "What's the best way to start saving for retirement?",
      details: "I'm in my early 30s and want to start planning for my retirement. Any tips?",
      category: "Adulting",
      isAnonymous: false,
      createdAt: "2025-04-11T10:00:00Z",
      color: "bg-pink-200",
      replies: [
        { text: "Start by opening a retirement account like a 401(k) or IRA." },
        { text: "Try to contribute at least 15% of your income toward retirement savings." }
      ]
    },
    {
      _id: "9",
      title: "How do I declutter my house?",
      details: "My house is full of stuff I don't need. How do I get started with decluttering?",
      category: "Home",
      isAnonymous: false,
      createdAt: "2025-04-10T15:30:00Z",
      color: "bg-green-200",
      replies: [
        { text: "Start with one room at a time and remove items you haven't used in the past year." },
        { text: "Donate, recycle, or sell items instead of just throwing them away." }
      ]
    },
    {
      _id: "10",
      title: "How do I manage work-life balance?",
      details: "I feel like I'm always working and don't have time for myself. Any tips for work-life balance?",
      category: "Life",
      isAnonymous: true,
      createdAt: "2025-04-09T09:00:00Z",
      color: "bg-blue-200",
      replies: [
        { text: "Set boundaries for work hours and make sure to take breaks throughout the day." },
        { text: "Schedule time for hobbies and social activities to recharge." }
      ]
    }
  ];

  const fetchQuestions = async () => {
    try {
      setQuestions(mockQuestions);
    } catch (err) {
      console.error("Error fetching questions", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const getRandomColor = () => {
    const colors = ["bg-yellow-200", "bg-green-200", "bg-pink-200", "bg-blue-200"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const postQuestion = async () => {
    try {
      const newQ = { 
        ...newQuestion, 
        _id: Date.now().toString(), 
        createdAt: new Date().toISOString(), 
        replies: [],
        color: getRandomColor()
      };
      setQuestions([newQ, ...questions]);
      setNewQuestion({ title: "", details: "", category: "", isAnonymous: false });
      setShowPostForm(false);
    } catch (err) {
      console.error("Error posting question", err);
    }
  };

  const replyToQuestion = async (id) => {
    try {
      const replyText = replies[id];
      if (!replyText.trim()) return;
      
      setQuestions(questions.map((q) => 
        q._id === id ? { ...q, replies: [...q.replies, { text: replyText }] } : q
      ));
      setReplies((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Error replying", err);
    }
  };

  const getRandomRotation = () => {
    return `rotate-${Math.random() > 0.5 ? '1' : '-1'}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Community Bulletin Board</h1>
          <button 
            onClick={() => setShowPostForm(!showPostForm)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow"
          >
            {showPostForm ? "Cancel" : "Pin a Question"}
          </button>
        </div>
        
        {showPostForm && (
          <div className="mb-8 p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Your Question</h2>
            <input
              value={newQuestion.title}
              onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              placeholder="What's your question?"
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <textarea
              value={newQuestion.details}
              onChange={(e) => setNewQuestion({ ...newQuestion, details: e.target.value })}
              placeholder="Details (optional)"
              className="w-full mb-3 p-2 border border-gray-300 rounded h-24"
            />
            <div className="flex flex-wrap gap-4 mb-3">
              <select
                value={newQuestion.category}
                onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">Select Category</option>
                <option value="DIY">DIY</option>
                <option value="Life">Life</option>
                <option value="Home">Home</option>
                <option value="Adulting">Adulting</option>
                <option value="Adulting">Job</option>
                <option value="Adulting">General Advice</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newQuestion.isAnonymous}
                  onChange={(e) => setNewQuestion({ ...newQuestion, isAnonymous: e.target.checked })}
                  className="mr-2"
                />
                Ask anonymously
              </label>
            </div>
            <button 
              onClick={postQuestion} 
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow"
            >
              📌 Pin to Board
            </button>
          </div>
        )}

        <div className="bg-blue-100 border-8 border-purple-800 rounded-lg p-6 min-h-screen">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((q) => (
              <div 
                key={q._id} 
                className={`${q.color} shadow-lg transform ${getRandomRotation()} relative p-4 rounded border border-gray-300`}
                style={{
                  boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
                  minHeight: "200px"
                }}
              >
                <div 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 shadow z-10"
                  style={{ 
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
                  }}
                ></div>
                
                <div className="mt-2">
                  <h3 className="text-lg font-bold mb-2">{q.title}</h3>
                  <p className="text-sm mb-3">{q.details}</p>
                  <div className="text-xs text-gray-600 mb-3">
                    {q.isAnonymous ? "👤 Anonymous" : "👥 User"} • {q.category} •{" "}
                    {new Date(q.createdAt).toLocaleDateString()}
                  </div>

                  {q.replies?.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-400">
                      {q.replies.map((r, idx) => (
                        <div key={idx} className="text-sm py-1 flex">
                          <span className="mr-1">💬</span> {r.text}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-auto pt-2 flex">
                    <input
                      value={replies[q._id] || ""}
                      onChange={(e) => setReplies({ ...replies, [q._id]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && replyToQuestion(q._id)}
                      placeholder="Add a reply..."
                      className="flex-1 text-sm p-1 border border-gray-400 rounded"
                    />
                    <button 
                      onClick={() => replyToQuestion(q._id)} 
                      className="ml-1 px-2 bg-blue-500 text-white rounded text-sm"
                    >
                      📝
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QandA;