import { useExtend, useTick } from '@pixi/react';
import { Graphics } from 'pixi.js';
import { useCallback, useMemo, useRef } from 'react';

type ParticleAreaProps = {
  width: number;
  height: number;
};

type Particle = {
  x: number;
  y: number;
  speed: number;
  color: number;
  drift: number;
  driftOffset: number;
};

const ParticleArea = ({ width, height }: ParticleAreaProps) => {
  useExtend({ Graphics });

  const particleCount = 1000;
  const radius = 5;
  const colors = [0x696969, 0x808080, 0xa9a9a9, 0xc0c0c0, 0xd3d3d3, 0xdcdcdc];

  // フレームカウンター（横揺れ用）
  const frameRef = useRef(0);

  // パーティクルの状態を1つのrefで管理（状態更新によるre-renderを避ける）
  const particlesRef = useRef<Particle[]>(
    Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: Math.random() * 0.5 - 0.25,
      driftOffset: Math.random() * Math.PI * 2,
    }))
  );

  // 全パーティクルを1つのGraphicsで描画
  const draw = useCallback(
    (graphics: Graphics) => {
      graphics.clear();

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        graphics.setFillStyle({ color: particle.color });
        graphics.circle(particle.x, particle.y, radius);
        graphics.fill();
      }
    },
    [radius]
  );

  // アニメーションループ
  const animate = useCallback(() => {
    frameRef.current += 1;
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      // Y座標を更新（落下）
      particle.y += particle.speed;

      // X座標を更新（横揺れ）
      particle.x += Math.sin(frameRef.current * 0.05 + particle.driftOffset) * particle.drift;

      // 画面下に到達したら上にリセット
      if (particle.y > height + radius) {
        particle.y = -radius;
        particle.x = Math.random() * width;
      }

      // 画面左右の境界チェック
      if (particle.x < -radius) {
        particle.x = width + radius;
      } else if (particle.x > width + radius) {
        particle.x = -radius;
      }
    }
  }, [width, height, radius]);

  useTick(delta => {
    animate();
  });

  return <pixiGraphics draw={draw} />;
};

export default ParticleArea;
