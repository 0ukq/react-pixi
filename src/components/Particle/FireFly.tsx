import { useExtend, useTick } from '@pixi/react';
import { Graphics, BlurFilter } from 'pixi.js';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  phase: number; // 点滅
}

const FireFly: React.FC<FireFlyProps> = ({ width, height }) => {
  useExtend({ Graphics });

  const particleCount = 250;

  // パーティクルの生成
  const createParticles = useCallback(() => {
    return [...Array(particleCount)].map((_, i) => {
      const angle = Math.random() * Math.PI * 2; // ランダムな方向
      const speed = Math.random() * 0.05; // 移動速度
      console.log(speed);

      return {
        id: i,
        color: 0xffffff,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        speed,
        radius: 1,
        alpha: 1,
        phase: Math.random() * Math.PI * 2, // ランダムな初期位相
      };
    });
  }, [width, height, particleCount]);

  const [particles, setParticles] = useState<Particle[]>(() => createParticles());
  const timeRef = useRef(0);
  const prevSizeRef = useRef({ width, height });

  // ウィンドウリサイズ時にパーティクルの位置を調整
  useEffect(() => {
    const prevWidth = prevSizeRef.current.width;
    const prevHeight = prevSizeRef.current.height;

    if (prevWidth !== width || prevHeight !== height) {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x;
          let newY = particle.y;

          // 画面縮小時、画面外のパーティクルを画面内に収める
          if (particle.x > width) {
            newX = width * Math.random();
          }
          if (particle.y > height) {
            newY = height * Math.random();
          }

          // 画面拡大時、一部のパーティクルを新しいエリアに拡散
          if (width > prevWidth || height > prevHeight) {
            if (Math.random() < 0.3) {
              // 30%の確率で新しいエリアに配置
              newX = Math.random() * width;
              newY = Math.random() * height;
            }
          }

          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );

      prevSizeRef.current = { width, height };
    }
  }, [width, height]);

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

        // ランダムに動くように調整
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
      graphics.filters = [new BlurFilter({ strength: 1 })];
    },
    [particles]
  );

  return <pixiGraphics draw={drawParticles} />;
};

export default FireFly;
