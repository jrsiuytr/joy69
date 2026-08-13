let activeScrollRaf: number | null = null;

export const smoothScrollTo = (targetY: number, duration = 900) => {
  if (activeScrollRaf !== null) {
    cancelAnimationFrame(activeScrollRaf);
    activeScrollRaf = null;
  }

  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  if (Math.abs(distance) < 4) return;

  let startTime: number | null = null;

  // Premium, silky smooth Ease-In-Out Cubic curve (Zero sudden acceleration, elegant deceleration)
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animationStep = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (timeElapsed < duration) {
      activeScrollRaf = requestAnimationFrame(animationStep);
    } else {
      activeScrollRaf = null;
    }
  };

  activeScrollRaf = requestAnimationFrame(animationStep);
};

export const smoothScrollToElement = (elementId: string, duration = 900) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const navOffset = 20;
  const targetY = Math.max(0, element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - navOffset);
  smoothScrollTo(targetY, duration);
};

