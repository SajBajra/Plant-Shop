import { Link } from "react-router"
import "./Home.css"

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Bring Nature Into Your Home</h1>
            <p>Discover our collection of beautiful indoor and outdoor plants</p>
            <Link to="/shop" className="btn btn-primary">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Quality Plants</h3>
              <p>All our plants are carefully selected and nurtured to ensure they thrive in your home.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>We ensure quick and safe delivery of your green friends right to your doorstep.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💧</div>
              <h3>Care Guides</h3>
              <p>Each plant comes with detailed care instructions to help you keep them healthy.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title text-center">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/shop" className="category-card">
              <div className="category-image indoor"></div>
              <h3>Indoor Plants</h3>
            </Link>

            <Link to="/shop" className="category-card">
              <div className="category-image outdoor"></div>
              <h3>Outdoor Plants</h3>
            </Link>

            <Link to="/shop" className="category-card">
              <div className="category-image succulents"></div>
              <h3>Succulents</h3>
            </Link>

            <Link to="/shop" className="category-card">
              <div className="category-image accessories"></div>
              <h3>Accessories</h3>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Plant Journey?</h2>
            <p>Join our community of plant lovers and transform your space with greenery.</p>
            <Link to="/signup" className="btn btn-primary">
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

