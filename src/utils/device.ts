export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isLowEnd: boolean;
  targetDPR: number;
  particleMultiplier: number;
  enableHeavyBlur: boolean;
}

export const getDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isLowEnd: false,
      targetDPR: 1.5,
      particleMultiplier: 1.0,
      enableHeavyBlur: true,
    };
  }

  const width = window.innerWidth;
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
  
  // Consider low-end if CPU cores <= 4 or RAM < 4GB or mobile browser
  const isLowEnd = cores <= 4 || memory < 4 || isMobile;

  const nativeDPR = window.devicePixelRatio || 1;
  const targetDPR = isLowEnd ? Math.min(nativeDPR, 1.25) : Math.min(nativeDPR, 1.75);
  const particleMultiplier = isLowEnd ? 0.4 : 1.0;
  const enableHeavyBlur = !isLowEnd;

  return {
    isMobile,
    isTablet,
    isLowEnd,
    targetDPR,
    particleMultiplier,
    enableHeavyBlur,
  };
};
