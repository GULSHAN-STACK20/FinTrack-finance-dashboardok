import { useEffect, useState } from 'react';

export function useAnimatedNumber(target: number, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    function step(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
