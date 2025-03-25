import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PlantShop</h3>
            <p>Your one-stop shop for all things green and leafy.</p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/shop">Shop</a>
              </li>
              <li>
                <a href="/login">Login</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@plantshop.com</p>
            <p>Phone: (123) 456-7890</p>
            <p>Address: 123 Green St, Plant City</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PlantShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

