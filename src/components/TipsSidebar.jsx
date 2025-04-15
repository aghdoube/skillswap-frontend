import React from 'react';

const TipItem = ({ number, text }) => (
  <div className="flex items-start gap-3">
    <div className="min-w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
      {number}
    </div>
    <p className="text-gray-700">{text}</p>
  </div>
);

const TipsSidebar = () => {
  const tips = [
    {
      number: 1,
      text: 'We show you profiles based on complementary skills - where what you offer matches what they want and vice versa.'
    },
    {
      number: 2,
      text: "Swipe right or click the check if you'd like to connect and swap skills with them."
    },
    {
      number: 3,
      text: 'If they also match with you, we\'ll open a chat so you can discuss your skill swap.'
    },
    {
      number: 4,
      text: 'Higher match percentages indicate more complementary skills between users.'
    }
  ];

  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">How Matching Works</h2>

        <div className="space-y-4">
          {tips.map(tip => (
            <TipItem key={tip.number} number={tip.number} text={tip.text} />
          ))}
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mt-6">
          <h3 className="font-medium text-yellow-800 mb-2">Pro Tip</h3>
          <p className="text-gray-700 text-sm">
            Complete your profile and add more skills you can offer to increase your chances of finding great matches!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TipsSidebar;
