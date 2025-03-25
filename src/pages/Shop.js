import { useState, useEffect } from "react"
import ProductCard from "../components/ProductCard"
import { productService, categoryService } from "../services/api"
import "./Shop.css"

const Shop = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
        ])

        setProducts(productsData)
        setFilteredProducts(productsData)
        setCategories(categoriesData)
        setLoading(false)
      } catch (err) {
        setError("Failed to load data. Please try again later.")
        setLoading(false)
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let results = products
    if (selectedCategory !== "all") {
      results = results.filter((product) => product.categoryId === Number.parseInt(selectedCategory))
    }
    if (searchTerm.trim() !== "") {
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredProducts(results)
  }, [searchTerm, selectedCategory, products])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  if (loading) {
    return (
      <div className="shop-page">
        <div className="container">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="shop-page">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="shop-page">
      <div className="container">
        <h1 className="section-title">Shop Plants</h1>

        <div className="filter-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search plants..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="category-filter">
            <label htmlFor="category-select">Filter by Category:</label>
            <select
              id="category-select"
              className="category-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <p>No plants found matching your search.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categories.find((c) => c.id === product.categoryId)?.name || "Uncategorized"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop

