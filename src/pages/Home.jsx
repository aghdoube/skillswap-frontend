import React from "react";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <main className="flex-grow container mx-auto px-6 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
            Discover, Share, and Grow Together.
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-lg">
            Whether you're here to mentor, collaborate, or learn,  SkillSwap connects you with people who can help you level up.
          </p>
        </div>

        <div className=" rounded-2xl p-8 max-w-md w-full mx-auto">
          
          <LoginForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
