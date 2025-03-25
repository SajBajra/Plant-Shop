import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useCart } from "../context/CartContext"
import "./Cart.css"

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(newTotal)
  }, [cart])

  const handleQuantityChange = (id, newQuantity) => {
    updateQuantity(id, Number.parseInt(newQuantity))
  }

  const handleRemove = (id) => {
    removeFromCart(id)
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="section-title">Your Cart</h1>
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="section-title">Your Cart</h1>

        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <label htmlFor={`quantity-${item.id}`}>Qty:</label>
                  <input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  />
                </div>
                <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="btn btn-outline clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

