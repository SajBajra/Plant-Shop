"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { userService } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const userData = await userService.login(email, password)
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    } catch (error) {
      throw new Error(error.message || "Login failed")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const register = async (userData) => {
    try {
      const newUser = await userService.register(userData)
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return newUser
    } catch (error) {
      throw new Error(error.message || "Registration failed")
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

