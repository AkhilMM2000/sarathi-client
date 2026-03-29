import { useRef, useEffect } from "react";

export function useDebounce(cb: (...args: any[]) => void, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latestCb = useRef(cb);

  useEffect(() => {
    latestCb.current = cb;
  }, [cb]);

  return (...args: any[]) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      latestCb.current(...args);
    }, delay);
  };
}
