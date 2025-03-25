import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { orderService } from "../services/api"
import "./Profile.css"

const Profile = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          setLoading(true)
          const userOrders = await orderService.getOrdersByUserId(user.id)
          setOrders(userOrders)
          setLoading(false)
        } catch (err) {
          setError("Failed to load your orders. Please try again later.")
          setLoading(false)
          console.error("Error fetching orders:", err)
        }
      }
    }

    fetchOrders()
  }, [user])

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading">Loading profile data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="section-title">My Profile</h1>

        <div className="profile-container">
          <div className="profile-info">
            <h2>Personal Information</h2>
            <div className="info-group">
              <label>Name:</label>
              <p>
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="info-group">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>
            {user.isAdmin && (
              <div className="admin-badge">
                <span>Admin</span>
              </div>
            )}
          </div>

          <div className="profile-orders">
            <h2>Order History</h2>

            {orders.length === 0 ? (
              <div className="no-orders">
                <p>You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>Order #{order.id}</h3>
                        <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge status-${order.status}`}>{order.status}</span>
                      </div>
                    </div>

                    <div className="order-items">
                      {order.items.map((item) => (
                        <div key={item.id} className="order-item">
                          <span className="item-name">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-total">
                      <span>Total:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

