import { BrowserRouter, Routes, Route } from 'react-router';
import Home from '../pages/page';
import NotFound from '../pages/not-found';

const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default AppRouter;
