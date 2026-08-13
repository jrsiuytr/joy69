import React from 'react';
import { FadeIn } from './FadeIn';

interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

const servicesData: ServiceItem[] = [
  {
    number: '01',
    name: 'Website Design',
    description:
      'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
  {
    number: '02',
    name: 'Community Moderator',
    description:
      'I have a team of community moderators who can moderate your community and provide support to your users.',
  },
  {
    number: '03',
    name: 'Logo Making',
    description:
      'Creating original and meaningful logos that reflect the brand identity and values.',
  },
  {
    number: '04',
    name: 'Digital Art',
    description:
      'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
  },
  {
    number: '05',
    name: 'Thumbnail Design',
    description:
      "Creation of eye-catching thumbnails for youtube videos that will grab the viewer's attention and make them want to click on the video.",
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="relative z-20 w-full px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-36 text-[#D7E2EA] overflow-hidden"
    >
      {/* Clean Dark Section Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050711]/80 to-transparent pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto relative z-10">
        <FadeIn delay={0} y={40}>
          <h2
            className="font-black uppercase text-center hero-heading leading-none mb-16 sm:mb-20 md:mb-28 tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Services
          </h2>
        </FadeIn>

        <div className="flex flex-col border-t border-white/15">
          {servicesData.map((item, index) => (
            <FadeIn key={item.number} delay={index * 0.1} y={30}>
              <div className={`flex flex-col md:flex-row items-start md:items-center justify-between py-8 sm:py-10 md:py-12 gap-6 md:gap-12 group hover:bg-white/5 px-4 rounded-2xl transition-colors ${
                index === servicesData.length - 1 ? '' : 'border-b border-white/15'
              }`}>
                {/* Left: Number */}
                <div
                  className="font-black text-red-500/80 group-hover:text-red-400 leading-none flex-shrink-0 transition-colors"
                  style={{ fontSize: 'clamp(2rem, 5vw, 64px)' }}
                >
                  {item.number}
                </div>

                {/* Center: Title */}
                <div className="md:w-1/3 flex-shrink-0">
                  <h3
                    className="font-extrabold uppercase text-white tracking-tight group-hover:text-cyan-400 transition-colors"
                    style={{ fontSize: 'clamp(1.5rem, 3.5vw, 44px)' }}
                  >
                    {item.name}
                  </h3>
                </div>

                {/* Right: Description */}
                <div className="md:w-1/2">
                  <p className="text-[#D7E2EA]/75 font-light text-base sm:text-lg sm:leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

