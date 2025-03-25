import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import "./Auth.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      navigate("/")
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-form-container">
          <h1 className="auth-title">Login</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>

          {/* Admin login info for demo purposes */}
          <div className="demo-info">
            <p>For demo purposes:</p>
            <p>Admin login: admin@example.com / admin123</p>
            <p>Or create a new account</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

