import xIcon from './images/x.svg';
import telegramIcon from './images/telegram-svgrepo-com.svg';
import discordIcon from './images/discord-communication-interaction-message-network-svgrepo-com.svg';
import { HeroSection } from './components/HeroSection';
import { MarqueeSection } from './components/MarqueeSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SpiderWebBackground } from './components/SpiderWebBackground';
import { FadeIn } from './components/FadeIn';
import { ContactButton } from './components/ContactButton';
import { Mail } from 'lucide-react';

export function App() {
  return (
    <div className="w-full bg-[#08080E] min-h-screen text-[#D7E2EA] overflow-x-clip font-['Kanit',sans-serif] relative">
      {/* Spider Web SVG Background Theme */}
      <SpiderWebBackground />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Marquee Section */}
      <MarqueeSection />

      {/* 3. About Section */}
      <AboutSection />

      {/* 4. Services Section */}
      <ServicesSection />

      {/* 5. Projects Section */}
      <ProjectsSection />

      {/* Footer / Contact Section */}
      <footer id="contact" className="bg-[#06070D] text-[#D7E2EA] pt-24 pb-12 px-6 md:px-10 border-t border-red-500/30 relative z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.9)]">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div>
              <FadeIn delay={0} y={20}>
                <h3 className="hero-heading font-black uppercase text-4xl sm:text-6xl md:text-7xl leading-tight">
                  NEVER GIVE UP
                </h3>
              </FadeIn>
              <FadeIn delay={0.1} y={20}>
                <p className="text-[#D7E2EA]/70 font-light text-lg sm:text-xl mt-4 max-w-md">
                  Every setback is a setup for a comeback.
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={0.2} y={20}>
              <ContactButton />
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
            <div>
              <h4 className="font-medium uppercase tracking-wider text-sm text-[#D7E2EA]/50 mb-3">Email</h4>
              <a href="mailto:jack@3dcreator.com" className="text-lg font-light hover:text-white transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" /> ig69onfire@gmail.com
              </a>
            </div>

            <div>
              <h4 className="font-medium uppercase tracking-wider text-sm text-[#D7E2EA]/50 mb-3">Socials</h4>
              <div className="flex gap-4 items-center">
                <a
                  href="https://x.com/gen69gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-white/10 hover:border-white/40 hover:bg-white/5 transition-colors flex items-center justify-center"
                  aria-label="X"
                >
                  <img src={xIcon} alt="X" className="w-4 h-4 invert" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-white/10 hover:border-white/40 hover:bg-white/5 transition-colors flex items-center justify-center"
                  aria-label="Telegram"
                >
                  <img src={telegramIcon} alt="Telegram" className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-white/10 hover:border-white/40 hover:bg-white/5 transition-colors flex items-center justify-center"
                  aria-label="Discord"
                >
                  <img src={discordIcon} alt="Discord" className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-medium uppercase tracking-wider text-sm text-[#D7E2EA]/50 mb-3">Location</h4>
              <p className="text-lg font-light">paradise</p>
            </div>

            <div>
              <h4 className="font-medium uppercase tracking-wider text-sm text-[#D7E2EA]/50 mb-3">Availability</h4>
              <p className="text-lg font-light text-emerald-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Open for Q3/Q4 Projects's Mod
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/5 text-sm text-[#D7E2EA]/40">
            <p>&copy; {new Date().getFullYear()} Joy69. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Gamer, Trader &amp; currently learning Full Stack Developement</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
