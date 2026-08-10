import React from 'react';
import bgThemeImg from '../images/spiderman_bg_theme_v3.png';

export const SpiderWebBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030407]">
      {/* 1. Crystal Clear Photorealistic 3D Silver Web Theme Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-90 transition-opacity duration-700"
        style={{ backgroundImage: `url(${bgThemeImg})` }}
      />

      {/* 2. Sharp Dark Protective Tint Layer (Dark but 100% Crystal Clear - Zero Blur) */}
      <div className="absolute inset-0 bg-[#030407]/55 pointer-events-none" />

      {/* 3. Deep Vignette Frame for Crisp Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030407]/65 via-transparent to-[#030407]/80 pointer-events-none" />
    </div>
  );
};
