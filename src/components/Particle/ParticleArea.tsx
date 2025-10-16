import { useExtend, useTick } from '@pixi/react';
import { Graphics } from 'pixi.js';
import { useCallback, useMemo, useState } from 'react';

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
  drift?: number;
  driftOffset?: number;
};

type Position = {
  x: number;
  y: number;
  speed: number;
};

const ParticleArea = ({ width, height }: ParticleAreaProps) => {
  useExtend({ Graphics });

  const particleCount = 100;
  const radius = 5;
  const colors = [0x696969, 0x808080, 0xa9a9a9, 0xc0c0c0, 0xd3d3d3, 0xdcdcdc];

  const initialPositions = [...Array(particleCount)].map(() => {
    return {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      speed: Math.random() * 2 + 0.5,
    };
  });
  const [positions, setPositions] = useState<Position[]>(initialPositions);

  const particles: Particle[] = useMemo(() => {
    const array = [...Array(particleCount)].map((_, index) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      return {
        id: index,
        color: colors[colorIndex],
        x: positions[index].x,
        y: positions[index].y,
        speed: positions[index].speed,
      };
    });
    return array;
  }, []);

  const animate = useCallback(() => {
    setPositions(prevPositions =>
      prevPositions.map(pos => {
        const newY = pos.y + pos.speed;
        return { ...pos, x: pos.x, y: pos.y > height ? 0 : newY };
      })
    );
  }, []);

  useTick(animate);

  return (
    <>
      {particles.map((particle, index) => {
        const draw = (graphics: Graphics) => {
          graphics.clear();
          graphics.setFillStyle({ color: particle.color });
          graphics.circle(particle.x, positions[index].y, radius);
          graphics.fill();
        };

        return <pixiGraphics key={particle.id} draw={draw} />;
      })}
    </>
  );
};
export default ParticleArea;

// import { useExtend, useTick } from '@pixi/react';
// import { Graphics } from 'pixi.js';
// import { useCallback, useMemo, useRef, useState } from 'react';

// type ParticleAreaProps = {
//   width: number;
//   height: number;
// };

// type Particle = {
//   id: number;
//   color: number;
//   x: number;
//   y: number;
//   speed: number;
//   drift: number; // 横揺れの速度
//   driftOffset: number; // 横揺れのオフセット
// };

// const ParticleArea = ({ width, height }: ParticleAreaProps) => {
//   useExtend({ Graphics });

//   const particleCount = 10000;
//   const radius = 5;
//   const colors = [0x696969, 0x808080, 0xa9a9a9, 0xc0c0c0, 0xd3d3d3, 0xdcdcdc];

//   const frameRef = useRef(0);

//   const initialParticles: Particle[] = useMemo(() => {
//     const array = [...Array(particleCount)].map((_, index) => {
//       const colorIndex = Math.floor(Math.random() * colors.length);
//       return {
//         id: index,
//         color: colors[colorIndex],
//         x: Math.random() * width,
//         y: Math.random() * height, // 初期位置を画面全体に分散
//         speed: Math.random() * 2 + 0.5, // 0.5 ~ 2.5の落下速度
//         drift: Math.random() * 0.5 - 0.25, // -0.25 ~ 0.25の横揺れ速度
//         driftOffset: Math.random() * Math.PI * 2, // 横揺れの初期位相
//       };
//     });
//     return array;
//   }, []);

//   const [particles, setParticles] = useState<Particle[]>(initialParticles);

//   const animate = useCallback(() => {
//     frameRef.current += 1;

//     setParticles(prevParticles => {
//       return prevParticles.map(particle => {
//         // 新しい位置を計算
//         let newY = particle.y + particle.speed;
//         let newX =
//           particle.x + Math.sin(frameRef.current * 0.05 + particle.driftOffset) * particle.drift;

//         // 画面下に到達したら上にリセット
//         if (newY > height + radius) {
//           newY = -radius;
//           newX = Math.random() * width;
//         }

//         // 画面左右からはみ出したら調整
//         if (newX < -radius) {
//           newX = width + radius;
//         } else if (newX > width + radius) {
//           newX = -radius;
//         }

//         // 新しいパーティクルオブジェクトを返す（イミュータブル）
//         return {
//           ...particle,
//           x: newX,
//           y: newY,
//         };
//       });
//     });
//   }, [width, height, radius, colors, particleCount]);

//   useTick(animate);

//   return (
//     <>
//       {particles.map(particle => {
//         const particleDraw = (graphics: Graphics) => {
//           graphics.clear();
//           graphics.setFillStyle({ color: particle.color });
//           graphics.circle(0, 0, radius);
//           graphics.fill();
//         };
//         return <pixiGraphics key={particle.id} draw={particleDraw} x={particle.x} y={particle.y} />;
//       })}
//     </>
//   );
// };
// export default ParticleArea;
