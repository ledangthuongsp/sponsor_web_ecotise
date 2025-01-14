// Import necessary libraries
import React from 'react';
import './landing_page.css';
const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="header">
        <div className="logo">Ecotise</div>
        <nav>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome to Ecotise</h1>
          <p>Your Sustainable</p>
          <h2>To Be Our Sponsor</h2>
          <p>"Discover Sustainability. Embrace Greenify. Your Eco-Friendly Haven for Conscious Shopping."</p>
          <button className="try-now-btn">Try now</button>
        </div>
        <div className="hero-image">
          <img src="/path/to/your/image.png" alt="Eco-friendly illustration" />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <h2>Why Choose Ecotise?</h2>
        <div className="features">
          <div className="feature-item">
            <img src="/path/to/sustainable-products-icon.png" alt="Sustainable Products Icon" />
            <h3>Sustainable Products</h3>
            <p>Explore our carefully curated selection of sustainable products, each designed to reduce your carbon footprint.</p>
          </div>
          <div className="feature-item">
            <img src="/path/to/eco-friendly-choices-icon.png" alt="Eco-Friendly Choices Icon" />
            <h3>Eco-Friendly Choices</h3>
            <p>Make conscious choices with our eco-friendly products, knowing that your purchases promote ethical sourcing and responsible manufacturing practices.</p>
          </div>
          <div className="feature-item">
            <img src="/path/to/high-quality-selection-icon.png" alt="High-Quality Selection Icon" />
            <h3>High-Quality Selection</h3>
            <p>Invest in long-lasting and reliable products that meet our stringent quality standards, ensuring your satisfaction and the longevity of your purchases.</p>
          </div>
          <div className="feature-item">
            <img src="/path/to/sustainable-packaging-icon.png" alt="Sustainable Packaging Icon" />
            <h3>Sustainable Packaging</h3>
            <p>Our sustainable packaging ensures that your orders arrive safely while minimizing their impact on the planet.</p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us" id="about">
        <h2>About Us</h2>
        <p>Ecotise is dedicated to promoting sustainable living through eco-friendly products and responsible practices. Join us in making a positive impact on the planet.</p>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>© 2025 Ecotise. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
