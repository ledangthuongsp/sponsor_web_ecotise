import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import heroImage from "../../assets/images/landing/popular.jpg"

const LandingPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLoginClick = () => {
    navigate("/authentication/signin#"); // Navigate to Signin page
  };

  const handleTryNowClick = () => {
    navigate("/authentication/signin#"); // Navigate to Signin page
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <img src="your-logo-url.png" alt="Logo" style={styles.logoImage} />
        </div>
        <nav style={styles.nav}>
          <a href="#home" style={styles.navItem}>Home</a>
          <a href="#about" style={styles.navItem}>About Us</a>
          <a href="#contact" style={styles.navItem}>Contact Us</a>
          <a href="#" onClick={handleLoginClick} style={styles.navItem}>Login</a> {/* Add Login link */}
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero} id="home">
        <div style={styles.heroText}>
          <h1>Welcome to Your Logo</h1>
          <p>Your Sustainable<br />To Be<br />Our Sponsor</p>
          <p>
            "Discover Sustainability. Embrace Greenify. Your Eco-Friendly Haven
            for Conscious Shopping."
          </p>
          <button style={styles.button} onClick={handleTryNowClick}>Try Now</button> {/* Add onClick to Try Now button */}
        </div>
        <div style={styles.heroImage}>
          <img
            src={heroImage}
            alt="Tree in a bubble"
            style={styles.image}
          />
        </div>
      </section>

      {/* Why Choose Section */}
      <section style={styles.whyChoose}>
        <h2>Why Choose Your Logo?</h2>
        <div style={styles.features}>
          <Feature
            icon="🌱"
            title="Sustainable Products"
            description="Explore our curated selection of sustainable products, each designed to reduce your carbon footprint."
          />
          <Feature
            icon="🛍️"
            title="Eco-Friendly Choices"
            description="Make conscious choices with our eco-friendly products, knowing that your purchases promote ethical sourcing."
          />
          <Feature
            icon="✔️"
            title="High-Quality Selection"
            description="Invest in reliable products that meet our stringent quality standards and ensure satisfaction."
          />
          <Feature
            icon="📦"
            title="Sustainable Packaging"
            description="Our packaging ensures that your orders arrive safely while minimizing their impact on the planet."
          />
        </div>
      </section>

      {/* About Us */}
      <section style={styles.about} id="about">
        <h2>About Us</h2>
        <p>
          At Your Logo, we are more than just an e-commerce website; we are a
          passionate community dedicated to fostering a sustainable and
          eco-friendly lifestyle. Our mission is to empower environmentally
          conscious consumers by offering high-quality products that inspire
          positive change.
        </p>
        <p>
          <strong>Mission Statement:</strong> "To be the leading platform for
          sustainable living, providing eco-friendly products and fostering a
          green community."
        </p>
        <p>
          <strong>Vision Statement:</strong> "To create a greener future for
          generations to come, where every choice matters."
        </p>
        <button style={styles.button} onClick={handleTryNowClick}>Read More</button>
      </section>

      {/* Customer Reviews */}
      <section style={styles.reviews} id="reviews">
        <h2>Customer Reviews</h2>
        <div style={styles.reviewCards}>
          <Review
            name="Sarah Johnson"
            review="I absolutely love my Organic Cotton Tote Bag! Highly recommend this sustainable accessory!"
          />
          <Review
            name="Mark Anderson"
            review="The Bamboo Toothbrushes are a game-changer! The quality is outstanding!"
          />
          <Review
            name="Emily Lee"
            review="I recently bought the Hemp Backpack, and it's fantastic! Perfect for daily commutes."
          />
        </div>
      </section>
    </div>
  );
};

// Individual Feature Component
const Feature: React.FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div style={styles.feature}>
    <div style={styles.icon}>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

// Individual Review Component
const Review: React.FC<{ name: string; review: string }> = ({ name, review }) => (
  <div style={styles.reviewCard}>
    <h4>{name}</h4>
    <p>{review}</p>
    <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
  </div>
);

// Inline Styles (for simplicity)
const styles: { [key: string]: React.CSSProperties } = {
  container: { 
    fontFamily: "Arial, sans-serif", lineHeight: 1.6 
  },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    padding: "10px 20px", 
    backgroundColor: "#f4f4f4" 
  },
  logo: { 
    display: "flex", 
    alignItems: "center" 
  },
  logoImage: { 
    height: "40px" 
  },
  nav: { 
    display: "flex", 
    gap: "15px" 
  },
  navItem: { 
    textDecoration: "none", 
    color: "#333", 
    fontWeight: "bold", 
    cursor: "pointer" },
  hero: { 
    display: "flex", 
    alignItems: "center", 
    padding: "20px" },
  heroText: { 
    flex: 1 
  },
  heroImage: { 
    flex: 1 
  },
  image: { 
    width: "100%", 
    borderRadius: "10px" 
  },
  button: { 
    padding: "10px 20px", 
    backgroundColor: "green", 
    color: "white", 
    border: "none", 
    borderRadius: "5px" 
  },
  whyChoose: { 
    padding: "20px", 
    textAlign: "center" 
  },
  features: { 
    display: "flex", 
    justifyContent: "space-around", 
    marginTop: "20px" },
  feature: { 
    width: "20%", 
    textAlign: "center" },
  icon: { 
    fontSize: "36px", 
    marginBottom: "10px" 
  },
  about: { 
    padding: "20px", 
    backgroundColor: "#f9f9f9", 
    textAlign: "center" 
  },
  reviews: { 
    padding: "20px", 
    textAlign: "center" 
  },
  reviewCards: { 
    display: "flex", 
    justifyContent: "space-around", 
    marginTop: "20px" 
  },
  reviewCard: { 
    width: "30%", 
    padding: "10px", 
    border: "1px solid #ddd", 
    borderRadius: "10px" 
  },
  stars: { 
    color: "#ffc107", 
    marginTop: "10px" 
  },
  contact: { 
    padding: "20px", 
    backgroundColor: "#f9f9f9", 
    textAlign: "center" 
  },
  contactForm: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "10px", 
    alignItems: "center" 
  },
  input: { 
    padding: "10px", 
    width: "80%", 
    maxWidth: "500px",
    borderRadius: "5px", 
    border: "1px solid #ccc" 
  },
  textarea: { 
    padding: "10px", 
    width: "80%", 
    maxWidth: "500px", 
    height: "100px", 
    borderRadius: "5px", 
    border: "1px solid #ccc" 
  },
  login: { 
    padding: "20px", 
    textAlign: "center" 
  },
  loginForm: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "10px", 
    alignItems: "center" 
  },
};

export default LandingPage;
