import React from "react";
import LoginForm from "../components/LoginForm";
import { Toaster } from "sonner";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">

<section className="text-center mt-16 mb-10">
  <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
    <div className="flex flex-col items-center">
     
      SkillSwap
    </div>
  </h1>
</section>


      <main className="flex-grow container mx-auto px-6 py-10 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left order-2 md:order-1">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
            Discover, Share, and Grow Together.
          </h2>
          <p className="mt-6 text-lg text-gray-700 max-w-lg mx-auto md:mx-0">
            Whether you're looking to share your expertise, learn a new skill,
            or find like-minded collaborators, SkillSwap empowers you to do it
            all. Create a personalized profile, highlight your talents, and
            connect with a growing community of passionate individuals eager to
            teach, learn, and grow together. From coding and design to music and
            marketing, there's always someone here ready to swap skills and
            spark new opportunities.{" "}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
            {[
              { color: "blue", text: "Mentor Others" },
              { color: "purple", text: "Learn New Skills" },
              { color: "indigo", text: "Build Connections" },
            ].map(({ color, text }) => (
              <div
                key={text}
                className={`flex items-center px-4 py-2 bg-${color}-50 rounded-full text-${color}-600`}
              >
                <span className={`h-2 w-2 rounded-full bg-${color}-500 mr-2`} />
                {text}
              </div>
            ))}
          </div>
        </div>

        <LoginForm className="order-1 md:order-2 rounded-2xl bg-white/60 shadow-md backdrop-blur p-6 max-w-md w-full mx-auto" />
      </main>

      <Toaster />
    </div>
  );
}
