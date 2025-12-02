import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppProvider } from './context/AppContext';
import { registerServiceWorker } from './hooks/usePWA';
import { initGA, initPerformanceMonitoring, useAnalytics } from './utils/analytics';
import Navigation from './components/Navigation';
import SEO from './components/SEO';
import Breadcrumbs from './components/Breadcrumbs';
import InstallPrompt from './components/InstallPrompt';
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

  useEffect(() => {
    // Initialize PWA
    registerServiceWorker();
    
    // Initialize analytics
    initGA();
    initPerformanceMonitoring();
  }, []);

  return (
    <div className="app">
      <SEO />
      <SeasonalAnimation />
      <Navigation />
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
  );
}

function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <Router basename="/klmaterial">
          <AppContent />
        </Router>
      </AppProvider>
    </HelmetProvider>
  );
}

export default App;
