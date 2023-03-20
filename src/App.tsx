import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ImageEncoder from './pages/ImageEncoder';
import MainLayout from './layout/MainLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="image-encoder" element={<ImageEncoder />} />
      </Route>
    </Routes>
  );
}
