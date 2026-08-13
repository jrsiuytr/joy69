import React from 'react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';

export const AboutSection: React.FC = () => {
  const aboutParagraphText =
    `I am a B.Tech. graduate in Computer Science and Engineering, with academic experience from 2016 to 2020. After college, I explored community building and gaming more seriously. In 2022, I built and managed a Discord server with over 5,000 members for esports and gaming, mainly around PUBG tournaments and scrims. I also worked on my own YouTube channel and reached the finalist stage in the JioGames FC Mobile Invitational Tournament.

In 2024, I stepped into Web3, started exploring airdrops, and developed a stronger interest in blockchain. That same curiosity pushed me back into building, so I began learning full-stack development and Web3 development again with the goal of creating useful products and communities.

My passions include gaming, blockchain development, crypto trading, and community building. I enjoy learning, creating, and growing ideas from the ground up, and I am currently focused on strengthening my full-stack and blockchain development skills.

With more than two years of experience in design, I focus on web design and user experience. I truly enjoy working with clients who aim to stand out and present their best image. Let me handle this for you!`;

  return (
    <section
      id="about"
      className="relative min-h-screen w-full bg-transparent px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-32 flex flex-col items-center justify-center overflow-hidden z-20"
    >
      {/* Clean Dark Section Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050711]/80 to-transparent pointer-events-none z-0" />

      {/* Decorative 3D images in 4 corners */}
      {/* Top-left: Moon icon */}
      <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10 pointer-events-none">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="Decorative Moon"
            loading="lazy"
            decoding="async"
            className="w-[120px] sm:w-[160px] md:w-[210px] object-contain drop-shadow-xl"
          />
        </FadeIn>
      </div>

      {/* Bottom-left: 3D object */}
      <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10 pointer-events-none">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="Decorative 3D Object"
            loading="lazy"
            decoding="async"
            className="w-[100px] sm:w-[140px] md:w-[180px] object-contain drop-shadow-xl"
          />
        </FadeIn>
      </div>

      {/* Top-right: Lego icon */}
      <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10 pointer-events-none">
        <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="Decorative Lego"
            loading="lazy"
            decoding="async"
            className="w-[120px] sm:w-[160px] md:w-[210px] object-contain drop-shadow-xl"
          />
        </FadeIn>
      </div>

      {/* Bottom-right: 3D group */}
      <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10 pointer-events-none">
        <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt="Decorative 3D Group"
            loading="lazy"
            decoding="async"
            className="w-[130px] sm:w-[170px] md:w-[220px] object-contain drop-shadow-xl"
          />
        </FadeIn>
      </div>

      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-center max-w-6xl md:max-w-7xl text-center w-full">
        {/* Heading */}
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About
          </h2>
        </FadeIn>

        {/* Description Glass Spotlight Card */}
        <FadeIn delay={0.15} y={30} className="w-full flex justify-center">
          <div className="mt-8 sm:mt-10 md:mt-12 px-6 sm:px-10 md:px-14 py-6 sm:py-8 md:py-10 rounded-3xl bg-[#060814]/85 border border-white/15 shadow-[0_0_70px_rgba(0,0,0,0.85)] backdrop-blur-xl max-w-4xl sm:max-w-5xl w-full mx-auto relative z-20 group hover:border-red-500/30 transition-all duration-500">
            <AnimatedText
              text={aboutParagraphText}
              className="text-white text-base sm:text-lg md:text-xl font-normal text-left sm:text-center leading-relaxed sm:leading-loose tracking-wide select-none drop-shadow-md"
            />
          </div>
        </FadeIn>

        {/* Spacing: gap-16 sm:gap-20 md:gap-24 between text block and button */}
        <div className="mt-10 sm:mt-12 md:mt-14">
          <FadeIn delay={0.25} y={20}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

