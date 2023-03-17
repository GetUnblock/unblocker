import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ImageEncoder from './pages/ImageEncoder';
import NavBar from './components/NavBar';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="image-encoder" element={<ImageEncoder />} />
      </Route>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
