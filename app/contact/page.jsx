'use client'
import React from 'react';
import ContactSection from '../components/contact/ContactSection';
import ContactBanner from '../components/contact/ContactBanner';

const page = () => {
    return (
        <div>
            <ContactBanner />
            <ContactSection />
          
        </div>
    );
};

export default page;