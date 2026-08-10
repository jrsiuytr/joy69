import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';

export const AboutSection: React.FC = () => {
  const aboutParagraphText =
    "With more than two years of experience in design, I focus on web design and user experience. I truly enjoy working with clients who aim to stand out and present their best image. Let me handle this for you!";

  return (
    <section
      id="about"
      className="relative min-h-screen w-full bg-transparent px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-32 flex flex-col items-center justify-center overflow-hidden z-20"
    >
      {/* Section Background Darkening Spotlight Overlay - Seamless Transparent Top & Bottom Blend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ amount: 0.2 }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060918]/95 via-40% to-transparent pointer-events-none z-0"
      />

      {/* Top Seam Soft Ambient Light Transition */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent blur-2xl pointer-events-none z-0" />

      {/* Bottom Seam Soft Ambient Light Transition into Services Section */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-transparent via-purple-900/15 to-transparent blur-2xl pointer-events-none z-0" />

      {/* Ambient Red/Purple/Cyan Glowing Spotlight Aura */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ amount: 0.2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-4xl h-[340px] bg-gradient-to-r from-red-600/30 via-purple-600/25 to-cyan-500/30 blur-[110px] rounded-full pointer-events-none z-0"
      />

      {/* Decorative 3D images in 4 corners */}
      {/* Top-left: Moon icon */}
      <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10 pointer-events-none">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="Decorative Moon"
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
            About me
          </h2>
        </FadeIn>

        {/* Description Glass Spotlight Card */}
        <FadeIn delay={0.15} y={30} className="w-full flex justify-center">
          <div className="mt-8 sm:mt-10 md:mt-12 px-6 sm:px-12 md:px-16 py-8 sm:py-10 md:py-12 rounded-3xl bg-[#060814]/85 border border-white/15 shadow-[0_0_70px_rgba(0,0,0,0.85)] backdrop-blur-xl max-w-5xl sm:max-w-6xl w-full mx-auto relative z-20 group hover:border-red-500/30 transition-all duration-500">
            <AnimatedText
              text={aboutParagraphText}
              className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[2.05rem] font-bold text-center leading-relaxed tracking-wide select-none drop-shadow-lg"
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

