"use client"
import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="container text-center mt-2">Loading...</div>
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" />
  }

  return children
}

export default AdminRoute

