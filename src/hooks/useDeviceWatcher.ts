/**
 * スマホ判定カスタムフック
 */

import { useEffect, useState } from 'react';

export const useDeviceWatcher = () => {
  const [isMobile, setIsMobile] = useState(false);
  const minPcWidth = 769;

  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      const mediaQueryList: MediaQueryList = window.matchMedia(`(min-width: ${minPcWidth}px)`);

      setIsMobile(window.innerWidth <= minPcWidth); // 初回読み込みでの判定

      // 画面サイズ変更のイベントリスナー
      const handleChange = (event: MediaQueryListEvent) => {
        event.matches ? setIsMobile(false) : setIsMobile(true);
      };
      mediaQueryList.addEventListener('change', handleChange);

      return () => {
        mediaQueryList.removeEventListener('change', handleChange); // クリーンアップ
      };
    }
  }, []);

  return { isMobile };
};
