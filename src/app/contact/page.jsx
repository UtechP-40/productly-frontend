"use client";

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const isAuthenticated = true; 
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Top SVG Wave */}
      <svg className="absolute top-0 left-0 w-full h-64 text-indigo-200 -z-10" preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path fill="currentColor" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,106.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
      </svg>

      <Navigation isAuthenticated={isAuthenticated} />

      <div className="p-8 bg-gray-100 min-h-screen">
        <motion.div
          className="max-w-lg mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl font-bold mb-4 text-center">Contact Us</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
              Submit
            </button>
          </form>
        </motion.div>
      </div>

      {/* Bottom SVG Wave */}
      <svg className="absolute bottom-0 left-0 w-full h-64 text-indigo-200 -z-10" preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path fill="currentColor" fillOpacity="1" d="M0,256L48,234.7C96,213,192,171,288,160C384,149,480,171,576,176C672,181,768,171,864,144C960,117,1056,75,1152,85.3C1248,96,1344,160,1392,192L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      </svg>
    </div>
  );
}
