"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa"
import "./Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Calculate total items in cart
    const count = cart.reduce((total, item) => total + item.quantity, 0)
    setCartCount(count)
  }, [cart])

  const handleLogout = () => {
    logout()
    navigate("/")
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">PlantShop</span>
        </Link>

        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`navbar-links ${mobileMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
              </li>
              {user.isAdmin && (
                <li>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>

        <Link to="/cart" className="cart-icon" onClick={() => setMobileMenuOpen(false)}>
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar

