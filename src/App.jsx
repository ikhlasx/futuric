import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BusinessSelector from './components/BusinessSelector';
import About from './components/About';
import WireframeSections from './components/WireframeSections';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <div className="noise-overlay"></div>
      <Navbar />
      <Hero />
      <BusinessSelector />
      <About />
      <WireframeSections />
      <Footer />
    </div>
  );
}

export default App;
