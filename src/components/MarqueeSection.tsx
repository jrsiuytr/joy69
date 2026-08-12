import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, RotateCcw, Sparkles } from 'lucide-react';
import { KineticTextFlip } from './KineticTextFlip';

import gtaviImg from '../images/games/gta6.webp';
import fc27Img from '../images/games/fc27.webp';
import acImg from '../images/games/asbf.webp';
import pubgImg from '../images/games/pubg.webp';
import apexImg from '../images/games/apex.webp';
import gowImg from '../images/games/gow.webp';
import cyberpunkImg from '../images/games/cyberpunk.webp';
import eldenringImg from '../images/games/eldenring.webp';
import codImg from '../images/games/cod.webp';
import valorantImg from '../images/games/valorant.webp';
import rdr2Img from '../images/games/rdr2.webp';
import spidermanImg from '../images/games/sm22.webp';
import wukongImg from '../images/games/wukong.webp';
import fortniteImg from '../images/games/fortnite copy.webp';
import helldivers2Img from '../images/games/helldivers2.webp';
import witcher3Img from '../images/games/witcher3.webp';
import cs2Img from '../images/games/cs2.webp';
import forza5Img from '../images/games/forza5.webp';
import overwatch2Img from '../images/games/overwatch2.webp';
import haloinfiniteImg from '../images/games/haloinfinite.webp';

export interface MarqueeItem {
  id: string;
  image: string;
  title: string;
  category: string;
  link: string;
}

const marqueeItemsData: MarqueeItem[] = [
  {
    id: '1',
    image: gtaviImg,
    title: 'Grand Theft Auto VI',
    category: 'Open World Action',
    link: 'https://www.rockstargames.com/VI',
  },
  {
    id: '2',
    image: fc27Img,
    title: 'EA SPORTS FC 25',
    category: 'Sports & Football',
    link: 'https://www.ea.com/games/ea-sports/ea-sports-fc/ea-sports-fc-25',
  },
  {
    id: '3',
    image: acImg,
    title: "Assassin's Creed IV: Black Flag",
    category: 'Pirate Action Adventure',
    link: 'https://store.ubisoft.com/us/game?pid=56c4948088a7e300458b46cc',
  },
  {
    id: '4',
    image: pubgImg,
    title: 'PUBG: BATTLEGROUNDS',
    category: 'Battle Royale',
    link: 'https://pubg.com/en/main',
  },
  {
    id: '5',
    image: apexImg,
    title: 'Apex Legends',
    category: 'Hero Shooter',
    link: 'https://www.ea.com/games/apex-legends',
  },
  {
    id: '6',
    image: gowImg,
    title: 'God of War Ragnarök',
    category: 'Action Mythological RPG',
    link: 'https://www.playstation.com/en-us/games/god-of-war-ragnarok/',
  },
  {
    id: '7',
    image: cyberpunkImg,
    title: 'Cyberpunk 2077: Phantom Liberty',
    category: 'Sci-Fi RPG',
    link: 'https://www.cyberpunk.net',
  },
  {
    id: '8',
    image: eldenringImg,
    title: 'Elden Ring: Shadow of the Erdtree',
    category: 'Dark Fantasy RPG',
    link: 'https://www.bandainamcoent.com/games/elden-ring',
  },
  {
    id: '9',
    image: codImg,
    title: 'Call of Duty: Black Ops 6',
    category: 'FPS Shooter',
    link: 'https://www.callofduty.com/blackops6',
  },
  {
    id: '10',
    image: valorantImg,
    title: 'Valorant',
    category: 'Tactical Shooter',
    link: 'https://playvalorant.com',
  },
  {
    id: '11',
    image: rdr2Img,
    title: 'Red Dead Redemption 2',
    category: 'Open World Western',
    link: 'https://www.rockstargames.com/reddeadredemption2',
  },
  {
    id: '12',
    image: spidermanImg,
    title: "Marvel's Spider-Man 2",
    category: 'Superhero Action',
    link: 'https://www.playstation.com/en-us/games/marvels-spider-man-2/',
  },
  {
    id: '13',
    image: wukongImg,
    title: 'Black Myth: Wukong',
    category: 'Action RPG',
    link: 'https://www.heishenhua.com',
  },
  {
    id: '14',
    image: fortniteImg,
    title: 'Fortnite',
    category: 'Battle Royale',
    link: 'https://www.fortnite.com',
  },
  {
    id: '15',
    image: helldivers2Img,
    title: 'Helldivers 2',
    category: 'Co-Op Shooter',
    link: 'https://www.playstation.com/en-us/games/helldivers-2/',
  },
  {
    id: '16',
    image: witcher3Img,
    title: 'The Witcher 3: Wild Hunt',
    category: 'Open World RPG',
    link: 'https://www.thewitcher.com',
  },
  {
    id: '17',
    image: cs2Img,
    title: 'Counter-Strike 2',
    category: 'Tactical FPS',
    link: 'https://www.counter-strike.net/cs2',
  },
  {
    id: '18',
    image: forza5Img,
    title: 'Forza Horizon 5',
    category: 'Open World Racing',
    link: 'https://forza.net/horizon',
  },
  {
    id: '19',
    image: overwatch2Img,
    title: 'Overwatch 2',
    category: 'Hero Shooter',
    link: 'https://overwatch.blizzard.com',
  },
  {
    id: '20',
    image: haloinfiniteImg,
    title: 'Halo Infinite',
    category: 'Sci-Fi FPS',
    link: 'https://www.xbox.com/en-US/games/halo-infinite',
  },
];

interface MarqueeCardProps {
  item: MarqueeItem;
}

const MarqueeCard: React.FC<MarqueeCardProps> = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Auto flip-back after 5 seconds
  useEffect(() => {
    if (!isFlipped) return;

    const timer = setTimeout(() => {
      setIsFlipped(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isFlipped]);

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-[300px] h-[190px] sm:w-[360px] sm:h-[230px] md:w-[420px] md:h-[270px] flex-shrink-0 cursor-pointer [perspective:1000px] group"
    >
      <div
        className={`relative w-full h-full duration-700 transition-all [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
      >
        {/* FRONT FACE (IMAGE) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-xl border border-white/10 [backface-visibility:hidden] ${item.image === spidermanImg
            ? 'bg-gradient-to-br from-red-950 via-slate-950 to-black flex items-center justify-center p-3'
            : 'bg-neutral-900'
            }`}
        >
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${item.image === spidermanImg
              ? 'object-contain drop-shadow-[0_10px_25px_rgba(220,38,38,0.6)]'
              : 'object-cover'
              }`}
          />
          {/* Subtle Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Click to flip & details</span>
            </div>
          </div>
        </div>

        {/* BACK FACE (CARD DETAILS & LINK) */}
        <div className="absolute inset-0 w-full h-full rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xl border border-purple-500/30 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {/* Decorative Back Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-800/50">
              {item.category}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              title="Flip back"
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Card Info */}
          <div className="z-10 my-auto">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight mb-1">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2">
              Explore the full interactive preview & features.
            </p>
          </div>

          {/* Action Link Button */}
          <div className="z-10">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
            >
              <KineticTextFlip text="Visit Website / Game" />
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MarqueeSection: React.FC = () => {
  const row1Original = marqueeItemsData.slice(0, 10);
  const row2Original = marqueeItemsData.slice(10, 20);

  const row1 = [...row1Original, ...row1Original];
  const row2 = [...row2Original, ...row2Original];

  return (
    <section className="bg-transparent pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden w-full relative z-20 select-none">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Row 1 - Smooth continuous 60FPS marquee moving RIGHT (pauses on hover) */}
        <div className="flex gap-4 sm:gap-6 w-max animate-marquee-right gpu-layer">
          {row1.map((item, index) => (
            <MarqueeCard key={`row1-${item.id}-${index}`} item={item} />
          ))}
        </div>

        {/* Row 2 - Smooth continuous 60FPS marquee moving LEFT (pauses on hover) */}
        <div className="flex gap-4 sm:gap-6 w-max animate-marquee-left gpu-layer">
          {row2.map((item, index) => (
            <MarqueeCard key={`row2-${item.id}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

