import { useExtend, useTick } from '@pixi/react';
import { Graphics } from 'pixi.js';
import { useCallback, useEffect, useState } from 'react';

type ParticleAreaProps = {
  width: number;
  height: number;
};

type Particle = {
  id: number;
  color: number;
  x: number;
  y: number;
  speed: number;
};

const ParticleArea = ({ width, height }: ParticleAreaProps) => {
  useExtend({ Graphics });

  const particleCount = 100;
  const radius = 5; // サイズを小さくして描画負荷軽減
  const colors = [0x696969, 0x808080, 0xa9a9a9, 0xc0c0c0, 0xd3d3d3, 0xdcdcdc];

  // 初期パーティクルを生成する関数
  const createParticles = useCallback(() => {
    return [...Array(particleCount)].map((_, index) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      return {
        id: index,
        color: colors[colorIndex],
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 2 + 0.5,
      };
    });
  }, [width, height, particleCount]);

  const [particles, setParticles] = useState<Particle[]>(() => createParticles());

  // リサイズでパーティクル再配置（最適化: 必要な時のみ実行）
  useEffect(() => {
    setParticles(prevParticles => {
      let needsUpdate = false;
      const updatedParticles = prevParticles.map(particle => {
        if (particle.x > width || particle.y > height) {
          needsUpdate = true;
          return {
            ...particle,
            x: particle.x > width ? Math.random() * width : particle.x,
            y: particle.y > height ? Math.random() * height : particle.y,
          };
        }
        return particle;
      });
      return needsUpdate ? updatedParticles : prevParticles;
    });
  }, [width, height]);

  const animate = useCallback(() => {
    setParticles(prevParticles => {
      const newParticles = [...prevParticles];
      for (let i = 0; i < newParticles.length; i++) {
        const particle = newParticles[i];
        const newY = particle.y + particle.speed;

        if (newY > height) {
          // 画面外判定
          newParticles[i] = {
            ...particle,
            y: -radius,
            x: Math.random() * width,
          };
        } else {
          // 通常の更新は既存オブジェクトを変更
          newParticles[i] = { ...particle, y: newY };
        }
      }
      return newParticles;
    });
  }, [height, width, radius]);

  useTick(animate);

  // パーティクル描画
  const drawAllParticles = useCallback(
    (graphics: Graphics) => {
      graphics.clear();

      const particlesByColor = particles.reduce(
        (acc, particle) => {
          if (!acc[particle.color]) acc[particle.color] = [];
          acc[particle.color].push(particle);
          return acc;
        },
        {} as Record<number, Particle[]>
      );

      Object.entries(particlesByColor).forEach(([color, colorParticles]) => {
        graphics.setFillStyle({ color: parseInt(color) });
        colorParticles.forEach(particle => {
          graphics.circle(particle.x, particle.y, radius);
        });
        graphics.fill();
      });
    },
    [particles, radius]
  );

  return <pixiGraphics draw={drawAllParticles} />;
};
export default ParticleArea;
