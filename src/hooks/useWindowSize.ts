import { useSyncExternalStore } from 'react';

type WindowSize = {
  width: number;
  height: number;
};

export const useWindowSize = (): WindowSize => {
  const getWindowWidth = () => window.innerWidth;
  const getWindowHeight = () => window.innerHeight;

  // hooksのサブスクライブ
  const subscribe = (callback: () => void) => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  };

  const width = useSyncExternalStore(subscribe, getWindowWidth);
  const height = useSyncExternalStore(subscribe, getWindowHeight);

  return { width, height };
};
