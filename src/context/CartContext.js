"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { cartService, orderService } from "../services/api"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Load cart and orders when user changes
  useEffect(() => {
    const fetchCartAndOrders = async () => {
      if (user) {
        try {
          // Fetch cart
          const userCart = await cartService.getCartByUserId(user.id)
          setCart(userCart.items || [])

          // Fetch orders
          const userOrders = await orderService.getOrdersByUserId(user.id)
          setOrders(userOrders)
        } catch (error) {
          console.error("Error fetching cart or orders:", error)
        }
      } else {
        // No user logged in, use local cart
        const localCart = localStorage.getItem("cart")
        if (localCart) {
          setCart(JSON.parse(localCart))
        } else {
          setCart([])
        }
      }
      setLoading(false)
    }

    fetchCartAndOrders()
  }, [user])

  // Save cart to localStorage or API when it changes
  useEffect(() => {
    if (!loading) {
      if (user) {
        // Save to API
        const saveCart = async () => {
          try {
            await cartService.updateCart({
              userId: user.id,
              items: cart,
            })
          } catch (error) {
            console.error("Error saving cart:", error)
          }
        }
        saveCart()
      } else {
        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify(cart))
      }
    }
  }, [cart, user, loading])

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        // Increase quantity if product already in cart
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Add new product to cart with quantity 1
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = async () => {
    setCart([])
    if (user) {
      try {
        await cartService.clearCart(user.id)
      } catch (error) {
        console.error("Error clearing cart:", error)
      }
    }
  }

  const placeOrder = async (orderDetails) => {
    try {
      const newOrder = {
        userId: user ? user.id : null,
        items: [...cart],
        ...orderDetails,
      }

      const createdOrder = await orderService.createOrder(newOrder)

      // Update local orders state
      setOrders((prevOrders) => [...prevOrders, createdOrder])

      // Clear the cart
      await clearCart()

      return createdOrder
    } catch (error) {
      console.error("Error placing order:", error)
      throw new Error("Failed to place order")
    }
  }

  // Fetch all orders (admin only)
  const fetchAllOrders = async () => {
    if (user && user.isAdmin) {
      try {
        const allOrders = await orderService.getOrders()
        return allOrders
      } catch (error) {
        console.error("Error fetching all orders:", error)
        throw new Error("Failed to fetch orders")
      }
    }
    return []
  }

  const value = {
    cart,
    orders,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    fetchAllOrders,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

