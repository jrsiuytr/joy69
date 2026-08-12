import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { LiveProjectButton } from './LiveProjectButton';
import utexo1Img from '../images/utexo1.webp';
import utexob from '../images/utexob.webp';
import utexofe from '../images/utexofe.webp';
import bloom from '../images/bloom1.webp';
import nao1 from '../images/nao1.webp';
import naol from '../images/naol.webp';
import naoban from '../images/naoxbanner.webp';

interface Project {
  number: string;
  name: string;
  category: string;
  col1Img1: string;
  col1Img2: string;
  col2Img: string;
  link: string;
}

const projectsData: Project[] = [
  {
    number: '01',
    name: 'UTEXO',
    category: 'MODERATOR',
    col1Img1: utexo1Img,
    col1Img2: utexob,
    col2Img: utexofe,
    link: 'https://utexo.com/',
  },
  {
    number: '02',
    name: 'Bloom',
    category: 'Alpha Tester, OG pass holder',
    link: 'https://www.bloom.social/',
    col1Img1: bloom,

    col1Img2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2Img:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  },

  {
    number: '03',
    name: 'NaoX Protocol (prev. Naoris)',
    category: 'OG Naorian👽',
    link: 'https://www.naox.org/',
    col1Img1: nao1,
    col1Img2: naoban,
    col2Img: naol,

  },
];

interface CardProps {
  project: Project;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
}

const ProjectCard: React.FC<CardProps> = ({ project, index, totalCards, progress }) => {
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const rangeStart = index / totalCards;
  const scale = useTransform(progress, [rangeStart, 1], [1, targetScale]);

  return (
    <div className="h-[85vh] flex items-center justify-center sticky top-24 md:top-32">
      <motion.div
        style={{
          scale,
          top: `${index * 28}px`,
        }}
        className="relative w-full max-w-6xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col gap-6 shadow-2xl overflow-hidden origin-top"
      >
        {/* Top Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D7E2EA]/20 pb-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <span
              className="font-black text-[#D7E2EA] leading-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col">
              <span
                className="font-light uppercase tracking-widest text-[#D7E2EA]/70"
                style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.1rem)' }}
              >
                {project.category}
              </span>
              <h3
                className="font-medium uppercase text-[#D7E2EA]"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.8rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>

          <LiveProjectButton href={project.link} />
        </div>

        {/* Bottom Row: 2-column image grid */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 w-full flex-grow">
          {/* Left column (40% width): 2 stacked images */}
          <div className="w-full md:w-[40%] flex flex-col gap-4">
            <img
              src={project.col1Img1}
              alt={`${project.name} preview 1`}
              loading="lazy"
              decoding="async"
              className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover shadow-lg border border-white/10"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <img
              src={project.col1Img2}
              alt={`${project.name} preview 2`}
              loading="lazy"
              decoding="async"
              className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover shadow-lg border border-white/10"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>

          {/* Right column (60% width): 1 tall image */}
          <div className="w-full md:w-[60%] flex flex-grow">
            <img
              src={project.col2Img}
              alt={`${project.name} main view`}
              loading="lazy"
              decoding="async"
              className="w-full h-full min-h-[250px] md:min-h-[400px] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover shadow-lg border border-white/10"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="bg-transparent rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-20 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 w-full min-h-screen"
    >
      <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase text-center leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Project
          </h2>
        </FadeIn>
      </div>

      {/* Cards container */}
      <div className="relative flex flex-col max-w-6xl mx-auto">
        {projectsData.map((project, index) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={index}
            totalCards={projectsData.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
};
