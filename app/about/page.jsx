'use client'
import React from 'react';
import AboutUsBanner from '../components/about/AboutUsBanner';
import TrustedOrganic from '../components/about/TrustedOrganic';
import WhyChooseUs from '../components/about/WhyChooseUs';
import TeamMembers from '../components/about/TeamMembers';
import Testimonials from '../components/about/Testimonials';
import FAQSection from '../components/about/FAQSection';
const About = () => {
    return (
        <div>
           <AboutUsBanner/>
           <TrustedOrganic/>
           <WhyChooseUs/>
           <TeamMembers/>
           {/* <Testimonials/> */}
           <FAQSection/>
        </div>
    );
};

export default About;