import React from 'react';
import './landing_page.css';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/paths';

const handleSignInClick = (navigate) => {
    navigate(paths.signin); // Điều hướng tới route Sign In
};

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section id="home" className="hero-section">
            <div className="hero-content">
                <h1>Welcome to Ecotise</h1>
                <p>Your Sustainable To Be Our Sponsor</p>
                <blockquote>"Discover Sustainability. Embrace Greenify. Your Eco-Friendly Haven for Conscious Shopping."</blockquote>
                <button className="cta-button" onClick={() => handleSignInClick(navigate)}>Try now</button>
            </div>
            <div className="hero-image">
                <img src="/path/to/tree-image.png" alt="Eco-friendly concept" />
            </div>
        </section>
    );
};

const Features = () => (
    <section className="why-choose-us">
        <h2>Why Choose Ecotise?</h2>
        <div className="features">
            <div className="feature">
                <img src="/path/to/icon1.png" alt="Sustainable Products" />
                <h3>Sustainable Products</h3>
                <p>Explore our carefully curated selection of sustainable products, each designed to reduce your carbon footprint.</p>
            </div>
            <div className="feature">
                <img src="/path/to/icon2.png" alt="Eco-Friendly Choices" />
                <h3>Eco-Friendly Choices</h3>
                <p>Make conscious choices with our eco-friendly products, knowing that your purchases promote ethical sourcing and responsible manufacturing practices.</p>
            </div>
            <div className="feature">
                <img src="/path/to/icon3.png" alt="High-Quality Selection" />
                <h3>High-Quality Selection</h3>
                <p>Invest in long-lasting and reliable products that meet our stringent quality standards, ensuring your satisfaction and the longevity of your purchases.</p>
            </div>
            <div className="feature">
                <img src="/path/to/icon4.png" alt="Sustainable Packaging" />
                <h3>Sustainable Packaging</h3>
                <p>Our sustainable packaging ensures that your orders arrive safely while minimizing their impact on the planet.</p>
            </div>
        </div>
    </section>
);

const Reviews = () => (
    <section className="reviews">
        <h2 style={{ textAlign: 'center' }}>Customer Reviews</h2>
        <div className="review-cards">
            {[
                { name: 'Sarah Johnson', img: '/path/to/reviewer1.jpg', text: 'The product from Ecotise exceeded my expectations!' },
                { name: 'Mark Anderson', img: '/path/to/reviewer2.jpg', text: 'Absolutely love the eco-friendly packaging!' },
                { name: 'Emily Lee', img: '/path/to/reviewer3.jpg', text: 'Great quality and sustainable choices!' }
            ].map((review, index) => (
                <div className="review-card" key={index}>
                    <img src={review.img} alt={review.name} className="reviewer-image" />
                    <p>{`"${review.text}"`}</p>
                    <h4>{review.name}</h4>
                    <p>⭐⭐⭐⭐⭐</p>
                </div>
            ))}
        </div>
    </section>
);

const Blogs = () => (
    <section className="blogs">
        <h2>Blogs</h2>
        <div className="blog-cards">
            {['Embracing Sustainability', 'Sustainable Living Made Simple', 'Guide to Eco-Friendly Shopping'].map((title, index) => (
                <div className="blog-card" key={index}>
                    <h3>{title}</h3>
                    <p>Learn more about {title.toLowerCase()}.</p>
                    <button>Read More</button>
                </div>
            ))}
        </div>
    </section>
);

const Footer = () => (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-logo">Ecotise</div>
            <div className="footer-links">
                <div className="footer-column">
                    <h4>Contact us</h4>
                    <p>Phone: +84 123456789</p>
                    <p>Email: info@ecotise.com</p>
                    <p>Address: 140/10 Dinh Bo Linh, Binh Thanh District, Ho Chi Minh City</p>
                </div>
                <div className="footer-column">
                    <h4>Follow us</h4>
                    <a href="#" className="social-icon">
                        <img src="/path/to/facebook-icon.png" alt="Facebook" />
                    </a>
                    <a href="#" className="social-icon">
                        <img src="/path/to/instagram-icon.png" alt="Instagram" />
                    </a>
                    <a href="#" className="social-icon">
                        <img src="/path/to/linkedin-icon.png" alt="LinkedIn" />
                    </a>
                    <a href="#" className="social-icon">
                        <img src="/path/to/twitter-icon.png" alt="Twitter" />
                    </a>
                </div>
            </div>
        </div>
        <p className="footer-credits">&copy; 2025 Ecotise. All rights reserved.</p>
    </footer>
);

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className="landing-page">
            <header className="header">
                <div className="logo">Ecotise</div>
                <nav className="navigation">
                    <a href="#home">Home</a>
                    <a href="#about">About Us</a>
                    <a href="#contact">Contact Us</a>
                    <a onClick={() => handleSignInClick(navigate)}>Sign In</a>
                </nav>
            </header>
            <Hero />
            <Features />
            <Reviews />
            <Blogs />
            <Footer />
        </div>
    );
};

export default LandingPage;
