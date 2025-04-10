import React from "react";

export default function Footer() {
  return (
    <footer className="py-6 text-center text-gray-600 text-sm bg-gray-200">
      <p>© 2025 SkillSwap. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Terms</a>
        <a href="#" className="hover:underline">Help</a>
      </div>
    </footer>
  );
}
