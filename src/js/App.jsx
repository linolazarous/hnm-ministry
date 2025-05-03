import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx';
import Donate from '../pages/Donate.jsx';
import Watch from '../pages/Watch.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/watch" element={<Watch />} />
    </Routes>
  );
}
