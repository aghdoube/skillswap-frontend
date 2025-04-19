import React from "react";
import { Twitter, Linkedin, Instagram } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t text-gray-700 text-sm py-10 px-6 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        <div>
          <h4 className="text-md font-semibold mb-2">About SkillSwap</h4>
          <p>
            SkillSwap is a platform for creators, learners, and mentors to
            connect, exchange knowledge, and grow together. Whether you're here
            to teach or to learn, you're in the right place.
          </p>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-2">Explore</h4>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Create Profile
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Browse Skills
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Community Guidelines
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-2">Support</h4>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-2">Get in Touch</h4>
          <p>
            Email:{" "}
            <a href="mailto:support@skillswap.com" className="hover:underline">
              support@skillswap.com
            </a>
          </p>
          <div className="mt-4 flex space-x-4">
            <a
              href="#"
              aria-label="Twitter"
              className="flex items-center space-x-2 hover:underline"
            >
              <Twitter size={24} className="text-blue-500" />
              <span>Twitter</span>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex items-center space-x-2 hover:underline"
            >
              <Linkedin size={24} className="text-blue-700" />
              <span>LinkedIn</span>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex items-center space-x-2 hover:underline"
            >
              <Instagram size={24} className="text-pink-500" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-500">
        © 2025 SkillSwap. All rights reserved.
      </div>
    </footer>
  );
}
