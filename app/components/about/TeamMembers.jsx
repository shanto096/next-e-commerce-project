// app/components/TeamMembers.jsx
'use client';


import Link from 'next/link';

// Social media SVG icons
const socialIcons = {
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 hover:text-[#80d00f] transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 5.016 3.657 9.176 8.441 9.923v-7.073H7.078V12h1.363V9.394c0-2.483 1.492-3.84 3.708-3.84 1.056 0 2.072.187 2.072.187v2.272h-1.205c-1.187 0-1.57.737-1.57 1.488V12h2.55l-.409 2.85H12.384v7.073C17.168 21.176 20.825 17.016 20.825 12 20.825 6.477 16.348 2 10.825 2h1.175z" />
    </svg>
  ),
  twitter: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 hover:text-[#80d00f] transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.25 6.388c-.77.342-1.597.57-2.463.67.886-.532 1.564-1.378 1.888-2.383-.83.493-1.75.85-2.73.97-.785-.83-1.897-1.348-3.13-1.348-2.364 0-4.28 1.916-4.28 4.28 0 .335.038.66.115.97-3.558-.178-6.712-1.884-8.823-4.474-.368.63-.58 1.36-.58 2.138 0 1.485.756 2.793 1.905 3.553-.703-.022-1.36-.215-1.933-.532v.053c0 2.072 1.47 3.805 3.42 4.19-.36.1-.737.15-1.13.15-.276 0-.546-.027-.81-.077.542 1.69 2.11 2.923 3.97 2.96-.92 1.25-2.22 1.99-3.568 1.99-.234 0-.466-.013-.695-.044.82 1.31 2.38 2.2 4.113 2.2 4.936 0 7.63-4.088 7.63-7.63 0-.116-.003-.232-.008-.348.817-.588 1.527-1.325 2.09-2.164z" />
    </svg>
  ),
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 hover:text-[#80d00f] transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.916 2.09c.652 0 1.05.348 1.05 1.025v17.76c0 .677-.398 1.025-1.05 1.025H3.084c-.652 0-1.05-.348-1.05-1.025V3.115c0-.677.398-1.025 1.05-1.025h17.832zM8.33 19.348V9.75h-2.9v9.598h2.9zM7.172 8.52a1.724 1.724 0 110-3.448 1.724 1.724 0 010 3.448zm12.306 10.828h-2.902v-5.263c0-.625-.01-1.429-.87-.87-1.353 0-1.56 1.058-1.56 2.052v4.081h-2.9v-9.598h2.784v1.306h.04c.386-.74 1.328-1.522 2.748-1.522 2.946 0 3.493 1.936 3.493 4.453v5.361z" />
    </svg>
  ),
};

const teamMembers = [
  {
    image:'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/1.jpg',
    role: 'founder',
    name: 'Rosalina D. William',
    socials: [
      { platform: 'facebook', url: '#' },
      { platform: 'twitter', url: '#' },
      { platform: 'linkedin', url: '#' },
    ],
  },
  {
    image: '	https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/2.jpg',
    role: 'founder',
    name: 'Rosalina D. William',
    socials: [
      { platform: 'facebook', url: '#' },
      { platform: 'twitter', url: '#' },
      { platform: 'linkedin', url: '#' },
    ],
  },
  {
    image: '	https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/3.jpg',
    role: 'founder',
    name: 'Rosalina D. William',
    socials: [
      { platform: 'facebook', url: '#' },
      { platform: 'twitter', url: '#' },
      { platform: 'linkedin', url: '#' },
    ],
  },
  {
    image: '	https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/4.jpg',
    role: 'founder',
    name: 'Rosalina D. William',
    socials: [
      { platform: 'facebook', url: '#' },
      { platform: 'twitter', url: '#' },
      { platform: 'linkedin', url: '#' },
    ],
  },
];

const TeamMembers = () => {
  return (
    <section className="bg-white py-20 md:py-24">
      {/* Section Title */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">
          Team Member
        </h2>
      </div>

      {/* Team Member Cards */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm"
            >
              {/* Member Image */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              
              {/* Member Details */}
              <p className="text-xs font-semibold text-[#80d00f] tracking-wide uppercase mb-2">
                // {member.role} //
              </p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {member.name}
              </h3>
              
              {/* Social Media Links */}
              <div className="flex justify-center gap-4">
                {member.socials.map((social, socialIndex) => (
                  <Link key={socialIndex} href={social.url} passHref>
                      {socialIcons[social.platform]}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembers;