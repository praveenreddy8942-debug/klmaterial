import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { registerServiceWorker } from './hooks/usePWA';
import { initGA, initPerformanceMonitoring, useAnalytics } from './utils/analytics';
import Navigation from './components/Navigation';
import SEO from './components/SEO';
import Breadcrumbs from './components/Breadcrumbs';
import InstallPrompt from './components/InstallPrompt';
import CommandPalette from './components/CommandPalette';
import ParticleNetwork from './components/ParticleNetwork';
import KeyboardHelper from './components/KeyboardHelper';
import LoadingScreen from './components/LoadingScreen';
import CursorTrail from './components/CursorTrail';
import MeshGradient from './components/MeshGradient';
import Home from './pages/Home';
import Materials from './pages/Materials';
import Roadmap from './pages/Roadmap';
import About from './pages/About';
import Contact from './pages/Contact';
import SeasonalAnimation from './components/SeasonalAnimation';
import BackToTop from './components/BackToTop';
import './App.css';

function AppContent() {
  useAnalytics(); // Auto-track page views
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize PWA
    registerServiceWorker();
    
    // Initialize analytics
    initGA();
    initPerformanceMonitoring();
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className="app">
        <SEO />
        <MeshGradient />
        <ParticleNetwork />
        <CursorTrail />
        <SeasonalAnimation />
        <Navigation />
        <CommandPalette />
        <KeyboardHelper />
        <main className="main-content">
          <Breadcrumbs />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <BackToTop />
        <InstallPrompt />
      </div>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <BookmarkProvider>
          <AppProvider>
            <Router>
              <AppContent />
            </Router>
          </AppProvider>
        </BookmarkProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
