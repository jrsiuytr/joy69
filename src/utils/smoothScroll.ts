export const smoothScrollTo = (targetY: number, duration = 1100) => {
  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  let startTime: number | null = null;

  // Premium, silky smooth Ease-Out Quintic deceleration curve (Gentle, elegant animated scroll)
  const easeOutQuint = (t: number): number => {
    const inv = 1 - t;
    return 1 - inv * inv * inv * inv * inv;
  };

  const animationStep = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeOutQuint(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (timeElapsed < duration) {
      requestAnimationFrame(animationStep);
    }
  };

  // Execute immediately on current frame
  requestAnimationFrame(animationStep);
};

export const smoothScrollToElement = (elementId: string, duration = 1100) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const targetY = element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
  smoothScrollTo(targetY, duration);
};
