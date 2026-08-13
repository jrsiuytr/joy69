import React from 'react';
import { WaterButton } from './WaterButton';

interface ContactButtonProps {
  onClick?: () => void;
  className?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({ onClick, className = '' }) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'mailto:ig69onfire@gmail.com';
      }
    }
  };

  return (
    <WaterButton
      label="CONTACT ME"
      onClick={handleClick}
      waterColor="#E50914"
      textColor="#FFFFFF"
      paddingX={32}
      paddingY={14}
      rounded={100}
      waterAmount={65}
      glass={{ tint: 'rgba(30, 0, 0, 0.4)', blur: 30, frost: 25 }}
      borderOptions={{ color: 'rgba(255, 46, 56, 0.8)', stroke: 1.5 }}
      shadowOptions={{ color: '#E50914', intensity: 35 }}
      font={{ fontFamily: 'Kanit, sans-serif', fontSize: '15px', fontWeight: 700, letterSpacing: '0.08em' }}
      className={className}
    />
  );
};

export default ContactButton;
