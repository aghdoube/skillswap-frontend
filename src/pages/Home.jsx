import React from "react";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex flex-col md:flex-row items-center justify-center flex-grow px-6 py-12 md:py-24">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-600">
            SkillSwap helps you connect and learn from others.
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Exchange skills, grow your network, and learn something new every day.
          </p>
        </div>

        <div className="mt-10 md:mt-0 md:ml-12">
          <LoginForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}