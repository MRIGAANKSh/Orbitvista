import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand Name */}
        <div className="text-gray-900 text-2xl md:text-3xl tracking-widest font-semibold">
          Orbit Vista
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center gap-6 text-gray-600 text-sm sm:text-base">
          <li className="hover:text-gray-900 transition-colors cursor-pointer">Home</li>
          <li className="hover:text-gray-900 transition-colors cursor-pointer">About</li>
          <li className="hover:text-gray-900 transition-colors cursor-pointer">Products</li>
          <li className="hover:text-gray-900 transition-colors cursor-pointer">Contact</li>
        </ul>

        {/* Social Media Icons */}
        <div className="flex gap-4">
          <a href="#" className="p-2 border border-gray-400 rounded-full hover:border-gray-900 hover:scale-105 transition-all">
            <FaFacebookF className="text-gray-700" />
          </a>
          <a href="#" className="p-2 border border-gray-400 rounded-full hover:border-gray-900 hover:scale-105 transition-all">
            <FaTwitter className="text-gray-700" />
          </a>
          <a href="#" className="p-2 border border-gray-400 rounded-full hover:border-gray-900 hover:scale-105 transition-all">
            <FaInstagram className="text-gray-700" />
          </a>
          <a href="#" className="p-2 border border-gray-400 rounded-full hover:border-gray-900 hover:scale-105 transition-all">
            <FaLinkedinIn className="text-gray-700" />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm border-t border-gray-200 py-4">
        © {new Date().getFullYear()} Orbit Vista. All rights reserved.
      </div>
    </footer>
  );
}
