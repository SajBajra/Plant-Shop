import axios from "axios"

const API_URL = "http://localhost:3001"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// User API services
export const userService = {
  // Get all users
  getUsers: async () => {
    const response = await api.get("/users")
    return response.data
  },

  // Get user by id
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  // Login user (find by email and password)
  login: async (email, password) => {
    const response = await api.get(`/users?email=${email}`)
    const user = response.data[0]

    if (user && user.password === password) {
      return user
    }

    throw new Error("Invalid credentials")
  },

  // Register new user
  register: async (userData) => {
    // Check if email already exists
    const existingUsers = await api.get(`/users?email=${userData.email}`)

    if (existingUsers.data.length > 0) {
      throw new Error("Email already in use")
    }

    const response = await api.post("/users", {
      ...userData,
      isAdmin: false,
    })

    return response.data
  },
}

// Category API services
export const categoryService = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get("/categories")
    return response.data
  },

  // Get category by id
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  // Create new category
  createCategory: async (categoryData) => {
    const response = await api.post("/categories", categoryData)
    return response.data
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData)
    return response.data
  },

  // Delete category
  deleteCategory: async (id) => {
    await api.delete(`/categories/${id}`)
    return { id }
  },
}

// Product API services
export const productService = {
  // Get all products
  getProducts: async () => {
    const response = await api.get("/products")
    return response.data
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/products?categoryId=${categoryId}`)
    return response.data
  },

  // Get product by id
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await api.post("/products", productData)
    return response.data
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  // Delete product
  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`)
    return { id }
  },
}

// Cart API services
export const cartService = {
  // Get cart by user id
  getCartByUserId: async (userId) => {
    const response = await api.get(`/carts?userId=${userId}`)
    return response.data[0] || { userId, items: [] }
  },

  // Create or update cart
  updateCart: async (cart) => {
    // Check if cart exists
    const existingCart = await api.get(`/carts?userId=${cart.userId}`)

    if (existingCart.data.length > 0) {
      // Update existing cart
      const response = await api.put(`/carts/${existingCart.data[0].id}`, cart)
      return response.data
    } else {
      // Create new cart
      const response = await api.post("/carts", cart)
      return response.data
    }
  },

  // Clear cart
  clearCart: async (userId) => {
    const existingCart = await api.get(`/carts?userId=${userId}`)

    if (existingCart.data.length > 0) {
      await api.patch(`/carts/${existingCart.data[0].id}`, { items: [] })
    }

    return { userId, items: [] }
  },
}

// Order API services
export const orderService = {
  // Get all orders
  getOrders: async () => {
    const response = await api.get("/orders")
    return response.data
  },

  // Get orders by user id
  getOrdersByUserId: async (userId) => {
    const response = await api.get(`/orders?userId=${userId}`)
    return response.data
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post("/orders", {
      ...orderData,
      date: new Date().toISOString(),
      status: "pending",
    })

    return response.data
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}`, { status })
    return response.data
  },
}

export default api

