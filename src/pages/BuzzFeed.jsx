import React, { useState, useEffect } from "react";
import { Star, MessageCircle, ThumbsUp, Flag, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReviewPage = ({ userId = "123" }) => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    recommendation: "",
    skillOffered: "", 
    skillReceived: "", 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [currentUser, setCurrentUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser({
      id: "current-user-id",
      name: "Sam Taylor", 
      avatar: "/assets/CurrentUserPic.png",
      skills: ["Web Development", "Cooking"],
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setUser({
        id: "123",
        name: "Alex Morgan",
        avatar: "/assets/id123.png",
        skills: ["Photography", "Spanish Language"],
        memberSince: "January 2023",
        swapsCompleted: 12,
      });

      const mockReviews = [
        {
          id: 1,
          authorId: "456",
          authorName: "Jamie Chen",
          authorAvatar: "/assets/id1.png",
          rating: 5,
          date: "2024-03-15",
          comment:
            "Alex taught me photography basics in exchange for cooking lessons. The sessions were incredibly helpful and well-structured. I went from not knowing how to use my DSLR to taking great photos in just three sessions!",
          recommendation:
            "Highly recommend for photography lessons, especially for beginners. Patient teacher with practical approach.",
          likes: 8,
          skillsExchanged: ["Photography", "Cooking"],
        },
        {
          id: 2,
          authorId: "789",
          authorName: "Taylor Williams",
          authorAvatar: "/assets/id2.png",
          rating: 4,
          date: "2024-02-28",
          comment:
            "Alex helped me improve my Spanish conversation skills. We had a good rapport and the sessions were enjoyable. Would definitely swap skills again!",
          recommendation:
            "Great for intermediate Spanish practice, especially conversational skills.",
          likes: 3,
          skillsExchanged: ["Spanish Language", "Web Development"],
        },
        {
          id: 3,
          authorId: "101",
          authorName: "Jordan Lee",
          authorAvatar: "/assets/id3.png",
          rating: 5,
          date: "2024-01-20",
          comment:
            "I learned so much during our photography sessions. Alex has a great eye for composition and explains technical concepts in an accessible way.",
          recommendation:
            "Perfect for anyone wanting to learn composition and lighting techniques.",
          likes: 12,
          skillsExchanged: ["Photography", "Financial Planning"],
        },
        {
          id: 4,
          authorId: "102",
          authorName: "Lena Park",
          authorAvatar: "/assets/id4.png",
          rating: 4,
          date: "2024-02-10",
          comment:
            "Jamie was super patient teaching me German basics. Loved the interactive style and cultural insights!",
          recommendation:
            "Highly recommend for anyone starting out with a new language.",
          likes: 9,
          skillsExchanged: ["German", "Yoga"],
        },
        {
          id: 5,
          authorId: "103",
          authorName: "Marco Rivera",
          authorAvatar: "/assets/id5.png",
          rating: 5,
          date: "2024-03-03",
          comment:
            "Katy's science explanations were so clear, even over video! And she really helped me understand tricky chemistry topics.",
          recommendation:
            "Ideal if you're looking for a fun and effective tutor in science.",
          likes: 15,
          skillsExchanged: ["High School Chemistry", "Digital Illustration"],
        },
      ];

      const uniqueReviews = mockReviews.filter(
        (review, index, self) =>
          index === self.findIndex((r) => r.id === review.id)
      );

      setReviews(uniqueReviews);

      const total = uniqueReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      setAverageRating(total / uniqueReviews.length);

      setIsLoading(false);
    }, 800);
  }, [userId]);

  const handleStarClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleStarHover = (rating) => {
    setHoveredStar(rating);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (
      newReview.rating === 0 ||
      !newReview.comment.trim() ||
      !newReview.skillOffered.trim() ||
      !newReview.skillReceived.trim()
    ) {
      alert("Please provide a rating, comment, and skills exchanged");
      return;
    }

    if (!currentUser) {
      alert("You must be logged in to leave a review");
      return;
    }

    const newReviewObj = {
      id: Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      rating: newReview.rating,
      date: new Date().toISOString().split("T")[0],
      comment: newReview.comment,
      recommendation: newReview.recommendation,
      likes: 0,
      skillsExchanged: [newReview.skillReceived, newReview.skillOffered],
    };

    setReviews([newReviewObj, ...reviews]);

    const total =
      reviews.reduce((sum, review) => sum + review.rating, 0) +
      newReview.rating;
    setAverageRating(total / (reviews.length + 1));

    setNewReview({
      rating: 0,
      comment: "",
      recommendation: "",
      skillOffered: "",
      skillReceived: "",
    });
  };

  const handleLikeReview = (reviewId) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, likes: review.likes + 1 } : review
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const renderStars = (rating, size = 20, interactive = false) => {
    return Array(5)
      .fill()
      .map((_, index) => {
        const starValue = index + 1;
        const filled = interactive
          ? (hoveredStar || newReview.rating) >= starValue
          : rating >= starValue;

        return (
          <Star
            key={index}
            size={size}
            className={`${
              filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onClick={interactive ? () => handleStarClick(starValue) : undefined}
            onMouseEnter={
              interactive ? () => handleStarHover(starValue) : undefined
            }
            onMouseLeave={interactive ? () => handleStarHover(0) : undefined}
          />
        );
      });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <button
        onClick={handleGoBack}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-700 rounded-md transition-colors duration-150"
      >
        <span className="text-base">←</span>
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex mr-2">{renderStars(averageRating)}</div>
                  <span className="font-semibold">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 ml-1">
                    ({reviews.length} reviews)
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-1" />
                  <span>Member since {user.memberSince}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MessageCircle size={16} className="mr-1" />
                  <span>{user.swapsCompleted} swaps completed</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-800 text-sm py-1 px-3 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Rating Summary</h2>
              <div className="flex items-center mb-4">
                <div className="text-4xl font-bold mr-4">
                  {averageRating.toFixed(1)}
                </div>
                <div>
                  <div className="flex mb-1">
                    {renderStars(averageRating, 24)}
                  </div>
                  <div className="text-gray-500">
                    Based on {reviews.length} reviews
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {[5, 4, 3, 2, 1].map((num) => {
                  const count = reviews.filter(
                    (review) => review.rating === num
                  ).length;
                  const percentage =
                    reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                  return (
                    <div key={num} className="flex items-center">
                      <div className="flex items-center w-12">
                        <span>{num}</span>
                        <Star
                          size={14}
                          className="ml-1 text-gray-400 fill-gray-400"
                        />
                      </div>
                      <div className="relative w-full h-2 bg-gray-200 rounded ml-2">
                        <div
                          className="absolute top-0 left-0 h-2 rounded"
                          style={{
                            width: `${percentage}%`,
                            background:
                              "linear-gradient(to right, #4f46e5, #60a5fa)", 
                          }}
                        ></div>
                      </div>
                      <span className="w-12 text-right text-sm text-gray-600">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
              {currentUser ? (
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Rating</label>
                    <div className="flex">{renderStars(0, 24, true)}</div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="comment"
                      className="block text-gray-700 mb-2"
                    >
                      Your Experience
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share details about your skill swap experience..."
                      value={newReview.comment}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="skillReceived"
                        className="block text-gray-700 mb-2"
                      >
                        Skill You Received
                      </label>
                      <input
                        type="text"
                        id="skillReceived"
                        name="skillReceived"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="What skill did you learn?"
                        value={newReview.skillReceived}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="skillOffered"
                        className="block text-gray-700 mb-2"
                      >
                        Skill You Offered
                      </label>
                      <input
                        type="text"
                        id="skillOffered"
                        name="skillOffered"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="What skill did you teach?"
                        value={newReview.skillOffered}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="recommendation"
                      className="block text-gray-700 mb-2"
                    >
                      Recommendation (optional)
                    </label>
                    <textarea
                      id="recommendation"
                      name="recommendation"
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="What would you recommend this user for?"
                      value={newReview.recommendation}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-3">
                    Please log in to write a review
                  </p>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    onClick={() => navigate("/login")}
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">User Reviews</h2>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <MessageCircle
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <p className="text-gray-600">
                  No reviews yet. Be the first to leave a review!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <img
                            src={review.authorAvatar}
                            alt={review.authorName}
                            className="w-12 h-12 rounded-full mr-4"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {review.authorName}
                            </h3>
                            <div className="flex items-center">
                              <div className="flex mr-2">
                                {renderStars(review.rating, 16)}
                              </div>
                              <span className="text-sm text-gray-600">
                                {new Date(review.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex text-sm">
                          <div className="px-2 py-1 bg-purple-100 text-gray-600 rounded-md flex items-center">
                            <span>Skills Exchanged:</span>
                            <span className="ml-1">
                              {review.skillsExchanged.join(" ↔ ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-700 whitespace-pre-line">
                          {review.comment}
                        </p>
                      </div>

                      {review.recommendation && (
                        <div className="bg-blue-50 p-3 rounded-md mb-4">
                          <p className="text-sm font-medium mb-1">
                            Recommendation:
                          </p>
                          <p className="text-gray-700 italic">
                            {review.recommendation}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <button
                          className="flex items-center text-gray-600 hover:text-blue-600"
                          onClick={() => handleLikeReview(review.id)}
                        >
                          <ThumbsUp size={16} className="mr-1" />
                          <span>Helpful ({review.likes})</span>
                        </button>

                        <button className="flex items-center text-gray-600 hover:text-red-600">
                          <Flag size={16} className="mr-1" />
                          <span>Report</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
