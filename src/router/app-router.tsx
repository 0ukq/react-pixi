import { BrowserRouter, Routes, Route } from 'react-router';
import Home from '../pages/page';
import NotFound from '../pages/not-found';
import Particle from '../pages/particle/page';
import ParticleFireFly from '../pages/particle-fire-fly/page';

const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/particle" element={<Particle />} />
          <Route path="/particle-fire-fly" element={<ParticleFireFly />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default AppRouter;
