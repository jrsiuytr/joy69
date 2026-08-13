import React from 'react';
import { WaterButton } from './WaterButton';

interface LiveProjectButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  waterColor?: string;
  borderColor?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  href = '#',
  onClick,
  className = '',
  waterColor = '#1D4ED8',
  borderColor = 'rgba(59, 130, 246, 0.7)',
}) => {
  return (
    <WaterButton
      label="PROJECT'S WEBSITE"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      waterColor={waterColor}
      textColor="#FFFFFF"
      paddingX={26}
      paddingY={12}
      rounded={100}
      waterAmount={55}
      glass={{ tint: 'rgba(0, 0, 0, 0.3)', blur: 25, frost: 20 }}
      borderOptions={{ color: borderColor, stroke: 1.5 }}
      font={{ fontFamily: 'Kanit, sans-serif', fontSize: '14px', fontWeight: 600, letterSpacing: '0.06em' }}
      className={className}
    />
  );
};

export default LiveProjectButton;
