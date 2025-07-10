import "../../styles/landing.css"; // Đường dẫn đúng tới file css của bạn
import { useState } from "react";
import { Link } from "react-router-dom";
import SponsorRegister from "./sponsor_register_tab";
// Ảnh import đúng đường dẫn của bạn
import heroImg from "../../assets/images/hero.jpg";
import butterfly from "../../assets/images/butterfly.svg";
import leafLight from "../../assets/icons/icon-leaf.svg";
import iconProducts from "../../assets/icons/icon-products.svg";
import iconChoices from "../../assets/icons/icon-choices.svg";
import iconQuality from "../../assets/icons/icon-quality.svg";
import iconPackaging from "../../assets/icons/icon-packaging.svg";
import reviewer1 from "../../assets/images/reviewer1.svg";
import reviewer2 from "../../assets/images/reviewer2.svg";
import reviewer3 from "../../assets/images/reviewer3.svg";
import blog1 from "../../assets/images/blog1.svg";
import blog2 from "../../assets/images/blog2.svg";
import blog3 from "../../assets/images/blog3.svg";
import earthIcon from "../../assets/icons/icon-earth.png";
import PropTypes from "prop-types";

function Navbar({ activeTab, onChangeTab }) {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="brand">Ecotise</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About us</a></li>
          <li><a href="#blogs">Blogs</a></li>
          <li><a href="#contact">Contact us</a></li>

          <li><a href="/sponsor-register">Sponsor Register</a></li>

          {/* Sign In link (route riêng) */}
          <li>
            <Link to="/hello">Sign In</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  activeTab: PropTypes.string,
  onChangeTab: PropTypes.func.isRequired,
};

const Button = ({ children, className }) => (
  <button className={"btn " + (className || "")}>{children}</button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const HeroSection = () => (
  <section className="hero-section" id="home">
    <div className="hero-text">
      <h1>
        Welcome to Ecotise <img src={butterfly} alt="butterfly"/>
      </h1>
      <p className="subtitle">Your Sustainable</p>
      <h2>
        To Be <br /> Our Sponsor
      </h2>
      <p className="desc">
        Discover Sustainability. Embrace Greenify. <br />
        Your Eco-Friendly Haven for Conscious Shopping.
      </p>
      <Button>Try now</Button>
      <img src={leafLight} alt="leaf light" className="hero-leaf" />
    </div>
    <div className="hero-image-container">
      <img src={heroImg} alt="Tree in hand" />
      <div className="hero-overlay-top"></div>
      <div className="hero-overlay-bottom"></div>
    </div>
  </section>
);

const WhyChoose = () => {
  const items = [
    {
      icon: iconProducts,
      title: "Sustainable Products",
      desc:
        "Explore our carefully curated selection of sustainable products, each designed to reduce your carbon footprint",
    },
    {
      icon: iconChoices,
      title: "Eco-Friendly Choices",
      desc:
        "Make conscious choices with our eco-friendly products, knowing that your purchases promote ethical sourcing and responsible manufacturing practices.",
    },
    {
      icon: iconQuality,
      title: "High-Quality Selection",
      desc:
        "Invest in long-lasting and reliable products that meet our stringent quality standards, ensuring your satisfaction and the longevity of your purchases.",
    },
    {
      icon: iconPackaging,
      title: "Sustainable Packaging",
      desc:
        "Our sustainable packaging ensures that your orders arrive safely while minimizing their impact on the planet.",
    },
  ];

  return (
    <section className="why-choose-section">
      <h2>Why Choose Ecotise?</h2>
      <div className="why-grid">
        {items.map(({ icon, title, desc }, i) => (
          <div key={i} className="why-card">
            <img src={icon} alt={title} />
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const AboutUs = () => (
  <section className="about-section" id="about">
    <img src={butterfly} alt="butterfly" className="butterfly" />
    <div className="about-content">
      <h3>Ecotise</h3>
      <p>
        At Greenify, we are more than just an e-commerce website; we are a passionate
        community dedicated to fostering a sustainable and eco-friendly lifestyle.
        Our mission is to empower environmentally conscious consumers by offering a
        curated selection of high-quality, sustainable products that inspire positive
        change and make a difference in the world.
      </p>
      <p className="mission-vision">Mission Statement</p>
      <p className="italic">
        To be the leading platform for sustainable living, providing eco-friendly
        products and fostering a green community that promotes conscious consumption
        and environmental responsibility.
      </p>
      <p className="mission-vision">Vision Statement</p>
      <p className="italic">
        To create a greener future for generations to come, where every choice
        matters, and sustainability is at the core of everyday living. We envision a
        world where eco-friendly practices are the norm, and together, we can make a
        significant impact on the health of our planet.
      </p>
      <Button>READ MORE</Button>
    </div>
  </section>
);

const CustomerReviews = () => {
  const reviews = [
    {
      name: "Sarah Johnson",
      img: reviewer1,
      text: `I absolutely love my Organic Cotton Tote Bag from Greenify! It's not only stylish but also eco-friendly. Knowing that I'm making a positive impact on the environment with my purchase makes me feel great. Highly recommend this sustainable accessory!`,
    },
    {
      name: "Mark Anderson",
      img: reviewer2,
      text: `The Bamboo Toothbrushes from Greenify are a game-changer! The quality is outstanding, and I love the fact that they are made from renewable bamboo. My oral care routine just got a lot greener, and I couldn't be happier. Kudos to Greenify for offering such fantastic eco-friendly products!`,
    },
    {
      name: "Emily Lee",
      img: reviewer3,
      text: `I recently bought the Hemp Backpack from Greenify, and I must say it's a fantastic investment. The durability of the hemp material is impressive, and I feel good knowing I'm choosing a sustainable alternative. This backpack is perfect for my outdoor adventures and daily commutes. Thumbs up for the eco-conscious design!`,
    },
  ];

  return (
    <section className="customer-section">
      <h2>Customer Reviews</h2>
      <div className="customer-list">
        {reviews.map(({ name, img, text }, i) => (
          <div key={i} className="customer-card">
            <img src={img} alt={name} />
            <div className="online-indicator"></div>
            <h4>{name}</h4>
            <p>{text}</p>
            <div className="stars">
              {[...Array(5)].map((_, idx) => (
                <svg
                  key={idx}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.92-.755 1.688-1.54 1.118L10 13.348l-3.37 2.448c-.785.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.624 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const BlogsSection = () => {
  const blogs = [
    {
      title: "Embracing Sustainability",
      subtitle: "The Power of Eco-Friendly Products at Greenify",
      img: blog1,
    },
    {
      title: "Sustainable Living Made Simple",
      subtitle: "How Greenify Helps You Make a Difference",
      img: blog2,
    },
    {
      title: "Greenify's Guide to Eco-Friendly Shopping",
      subtitle: "Reducing Your Carbon Footprint One Purchase at a Time",
      img: blog3,
    },
  ];

  return (
    <section className="blogs-section" id="blogs">
      <h2>Blogs</h2>
      <div className="blogs-list">
        {blogs.map(({ title, subtitle, img }, i) => (
          <div key={i} className="blog-card">
            <img src={img} alt={title} />
            <h3>{title}</h3>
            <p>{subtitle}</p>
            <Button>READ MORE</Button>
          </div>
        ))}
      </div>
    </section>
  );
};

const SubscribeSection = () => (
  <section className="subscribe-section">
    <img
      src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      alt="eco cutlery"
    />
    <div className="subscribe-content">
      <h3>Subscribe to our newsletter</h3>
      <p>
        Join our green community and receive exclusive offers and insightful content
        straight to your inbox!
      </p>
      <form className="subscribe-form">
        <input type="text" placeholder="Enter your name" />
        <input type="email" placeholder="Enter your e-mail" />
        <Button>SUBSCRIBE</Button>
      </form>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer" id="contact">
    <div className="container">
      <div>
        <h4 className="brand">Ecotise</h4>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About us</a>
          <a href="#contact">Contact us</a>
        </nav>
        <div className="socials">
          <a href="#" aria-label="Facebook">📘</a>
          <a href="#" aria-label="Instagram">📸</a>
          <a href="#" aria-label="LinkedIn">🔗</a>
          <a href="#" aria-label="Twitter">🐦</a>
        </div>
      </div>
      <div className="contact">
        <h4>Contact us</h4>
        <p>📞 +84 123456789</p>
        <p>✉️ info@ecotise.com</p>
        <p>📍 140/10 Dinh Bo Linh,</p>
        <p>Bình Thanh District</p>
        <p>Ho Chi Minh City</p>
      </div>
    </div>
    <p className="copy">
      Terms & services <br /> Ecotise @ all right reserved 2024
    </p>
    <img src={earthIcon} alt="earth" className="earth" />
  </footer>
);

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(null);
  return (
    <>
      <Navbar activeTab={activeTab} onChangeTab={setActiveTab} />
      <HeroSection />
      <WhyChoose />
      <AboutUs />
      <CustomerReviews />
      <BlogsSection />
      <SubscribeSection />
      <Footer />
      {activeTab === "sponsor" && <SponsorRegister />}
    </>
  );
}