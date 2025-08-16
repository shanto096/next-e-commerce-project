'use client';

import React, { useState } from 'react';
import MapComponent from './MapComponent';

export default function ContactSection() {
  // Step 1: State
  const [formData, setFormData] = useState({
 
    email: '',
    subject: '',
    message: '',
  });

  // Step 2: Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 3: Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData); // You can send to backend here
    // Reset form (optional)
    setFormData({ email: '', subject: '', message: '' });
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-24 py-12">
      <div
        style={{ background: 'var(--card-bg)', color: 'var(--foreground)' }}
        className="rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-16 space-y-10 transition-colors duration-500"
      >
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Image & Info */}
          <div className="lg:w-1/2 flex flex-col items-start">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkts2eD40Wv-ukeKakpk_httcnOkh17ZRL7w&s"
              alt="Contact Image"
              className="w-full rounded-lg shadow-md mb-6"
            />

            <div
              style={{
                background: 'var(--background)',
                color: 'var(--foreground)',
              }}
              className="p-6 rounded-lg w-full space-y-4"
            >
              <div>
                <h4 className="text-lg font-semibold">ADDRESS</h4>
                <p>40 Park Ave, Brooklyn, New York 70250</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold">PHONE</h4>
                <p>000-111-222</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold">EMAIL</h4>
                <p>contact@example.com</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-green-600">GET IN TOUCH</h2>
            <p className="mb-6">
              Maecenas ornare varius mauris eu commodo. Aenean nibh risus,
              rhoncus eget consectetur ac.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-4">
              
                <div className="w-full">
                  <label htmlFor="email" className="block mb-2 font-medium text-sm">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded bg-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block mb-2 font-medium text-sm">
                  Subject<span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 font-medium text-sm">
                  Message<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-transparent"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-8  py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <MapComponent />

        {/* Bottom Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-t pt-10">
          <div>
            <h4 className="font-bold mb-2">ADDRESS:</h4>
            <p>Dino Restaurant</p>
            <p>40 Park Ave, Brooklyn, New York 70250</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">RESERVATION:</h4>
            <p>000-111-222</p>
            <p>contact@example.com</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">OPEN HOURS:</h4>
            <p>Monday – Friday: 10 AM – 11 PM</p>
            <p>Saturday – Sunday: 9 AM – 1 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
