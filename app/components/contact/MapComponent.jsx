// components/MapComponent.jsx
'use client';
import React from 'react';

const MapComponent = () => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mt-10">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2254.386050771214!2d88.74976112146126!3d24.917948512981162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fb7f23a6d48bf9%3A0x589c61f370935e!2z4Kau4Ka54Ka-4Kam4KeH4Kas4Kaq4KeB4KawIOCmrOCmvuCmuCDgprjgp43gpp_gp43gpq_gpr7gpqjgp43gpqE!5e0!3m2!1sen!2sbd!4v1754546781495!5m2!1sen!2sbd" 
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapComponent;
