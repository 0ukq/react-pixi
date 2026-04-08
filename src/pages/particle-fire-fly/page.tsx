import { Application } from '@pixi/react';
import { useRef } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';
import FireFly from '../../components/Particle/FireFly';

export default function ParticleFireFly() {
  const { width, height } = useWindowSize();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}>
      <Application
        width={width}
        height={height}
        resizeTo={containerRef}
        background={'#444341'}
        antialias={true}
      >
        <FireFly width={width} height={height} />
      </Application>
    </div>
  );
}
