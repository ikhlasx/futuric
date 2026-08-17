import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BusinessSelector from './components/BusinessSelector';
import NexaFlagship from './components/NexaFlagship';
import NexaCapabilities from './components/NexaCapabilities';
import Industries from './components/Industries';
import DeliveryProcess from './components/DeliveryProcess';
import Performance from './components/Performance';
import WhyNexa from './components/WhyNexa';
import About from './components/About';
import Leadership from './components/Leadership';
import GlobalNetwork from './components/GlobalNetwork';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <div className="noise-overlay"></div>
      <Navbar />
      <Hero />
      <BusinessSelector />
      
      {/* Nexa Flagship Section */}
      <NexaFlagship />
      <NexaCapabilities />
      <Industries />
      <DeliveryProcess />
      <Performance />
      <WhyNexa />

      {/* Corporate Info */}
      <About />
      <Leadership />
      <GlobalNetwork />
      <ContactCTA />
      
      <Footer />
    </div>
  );
}

export default App;
