import { useExtend, useTick } from '@pixi/react';
import { Graphics, BlurFilter } from 'pixi.js';
import { useCallback, useRef, useState } from 'react';

interface FireFlyProps {
  width: number;
  height: number;
}

interface Particle {
  id: number;
  color: number;
  x: number;
  y: number;
  vx: number; // x方向の速度
  vy: number; // y方向の速度
  speed: number;
  radius: number;
  alpha: number;
  phase: number; // 位相（点滅のタイミング）
}

const FireFly: React.FC<FireFlyProps> = ({ width, height }) => {
  useExtend({ Graphics });

  const particleCount = 30;

  // パーティクルの生成
  const createParticles = useCallback(() => {
    return [...Array(particleCount)].map((_, i) => {
      const angle = Math.random() * Math.PI * 2; // ランダムな方向
      const speed = Math.random() * 0.2; // 移動速度
      return {
        id: i,
        color: 0xffffff,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        speed,
        radius: Math.random() * 2 + 2, // 2〜4の間のランダムな値
        alpha: 1,
        phase: Math.random() * Math.PI * 2, // ランダムな初期位相
      };
    });
  }, [width, height, particleCount]);

  const [particles, setParticles] = useState<Particle[]>(() => createParticles());
  const timeRef = useRef(0);

  // 時間経過とともにアルファ値と位置を更新
  useTick(ticker => {
    timeRef.current += ticker.deltaTime * 0.02; // 速度調整

    setParticles(prevParticles =>
      prevParticles.map(particle => {
        // 位置を更新
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;

        // 画面外対策
        if (newX < 0) newX = width;
        if (newX > width) newX = 0;
        if (newY < 0) newY = height;
        if (newY > height) newY = 0;

        // たまにランダムに方向を微調整（蛍っぽいふわふわした動き）
        let newVx = particle.vx;
        let newVy = particle.vy;
        if (Math.random() < 0.02) {
          newVx += (Math.random() - 0.5) * 0.1;
          newVy += (Math.random() - 0.5) * 0.1;
          // 速度を制限
          const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
          if (currentSpeed > 1) {
            newVx = (newVx / currentSpeed) * 1;
            newVy = (newVy / currentSpeed) * 1;
          }
        }

        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          alpha: (Math.sin(timeRef.current + particle.phase) + 1) * 0.5,
        };
      })
    );
  });

  // パーティクルの描画
  const drawParticles = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      particles.forEach(particle => {
        graphics.circle(particle.x, particle.y, particle.radius);
        graphics.fill({ color: particle.color, alpha: particle.alpha });
      });
      graphics.filters = [new BlurFilter({ strength: 3 })];
    },
    [particles]
  );

  return <pixiGraphics draw={drawParticles} />;
};

export default FireFly;
