import axios from "axios"

const API_URL = "http://localhost:3001"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const userService = {
  getUsers: async () => {
    const response = await api.get("/users")
    return response.data
  },
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },
  login: async (email, password) => {
    const response = await api.get(`/users?email=${email}`)
    const user = response.data[0]

    if (user && user.password === password) {
      return user
    }

    throw new Error("Invalid credentials")
  },
  register: async (userData) => {
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
export const categoryService = {
  getCategories: async () => {
    const response = await api.get("/categories")
    return response.data
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  createCategory: async (categoryData) => {
    const response = await api.post("/categories", categoryData)
    return response.data
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData)
    return response.data
  },

  deleteCategory: async (id) => {
    await api.delete(`/categories/${id}`)
    return { id }
  },
}

export const productService = {
  getProducts: async () => {
    const response = await api.get("/products")
    return response.data
  },

  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/products?categoryId=${categoryId}`)
    return response.data
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  createProduct: async (productData) => {
    const response = await api.post("/products", productData)
    return response.data
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`)
    return { id }
  },
}

export const cartService = {
  getCartByUserId: async (userId) => {
    const response = await api.get(`/carts?userId=${userId}`)
    return response.data[0] || { userId, items: [] }
  },

  updateCart: async (cart) => {
    const existingCart = await api.get(`/carts?userId=${cart.userId}`)

    if (existingCart.data.length > 0) {
      const response = await api.put(`/carts/${existingCart.data[0].id}`, cart)
      return response.data
    } else {
      const response = await api.post("/carts", cart)
      return response.data
    }
  },

  clearCart: async (userId) => {
    const existingCart = await api.get(`/carts?userId=${userId}`)

    if (existingCart.data.length > 0) {
      await api.patch(`/carts/${existingCart.data[0].id}`, { items: [] })
    }

    return { userId, items: [] }
  },
}

export const orderService = {
  getOrders: async () => {
    const response = await api.get("/orders")
    return response.data
  },
  getOrdersByUserId: async (userId) => {
    const response = await api.get(`/orders?userId=${userId}`)
    return response.data
  },

  createOrder: async (orderData) => {
    const response = await api.post("/orders", {
      ...orderData,
      date: new Date().toISOString(),
      status: "pending",
    })

    return response.data
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}`, { status })
    return response.data
  },
}

export default api

