import { Application } from '@pixi/react';
import { useWindowSize } from '../../hooks/useWindowSize';
import styles from './page.module.css';
import { useRef } from 'react';
import ParticleArea from '../../components/Particle/ParticleArea';

export default function Particle() {
  const { width, height } = useWindowSize();
  const containerRef = useRef<HTMLDivElement>(null);

  console.log('a');

  return (
    <>
      <div className={styles.fv}>
        <div
          className={styles.container}
          style={{ width: width, height: height }}
          ref={containerRef}
        >
          <Application
            width={width}
            height={height}
            antialias
            background={'#eee'}
            resizeTo={containerRef}
          >
            <ParticleArea width={width} height={height} />
          </Application>
        </div>
        <h1>Pixi.js Particle</h1>
      </div>
    </>
  );
}
