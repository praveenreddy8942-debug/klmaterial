import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Materials from './pages/Materials';
import Roadmap from './pages/Roadmap';
import About from './pages/About';
import Contact from './pages/Contact';
import SeasonalAnimation from './components/SeasonalAnimation';
import BackToTop from './components/BackToTop';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router basename="/klmaterial">
        <div className="app">
          <SeasonalAnimation />
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <BackToTop />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
