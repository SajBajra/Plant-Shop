import { useState, useEffect } from "react"
import { Card, Statistic, Table, Typography, Button } from "antd"
import { ShoppingOutlined, UserOutlined, FileOutlined, TagsOutlined } from "@ant-design/icons"
import { Link } from "react-router"
import { productService, userService, orderService, categoryService } from "../../services/api"

const { Title } = Typography

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    categories: 0,
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all data in parallel
        const [products, users, orders, categories] = await Promise.all([
          productService.getProducts().catch(() => []),
          userService.getUsers().catch(() => []),
          orderService.getOrders().catch(() => []),
          categoryService.getCategories().catch(() => []),
        ])

        setStats({
          products: products.length || 0,
          users: users.length || 0,
          orders: orders.length || 0,
          categories: categories.length || 0,
        })

        // Get recent orders (last 5)
        const sortedOrders = [...orders]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)

        setRecentOrders(sortedOrders)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id}`,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => `${customer?.firstName ?? "Unknown"} ${customer?.lastName ?? ""}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `$${total?.toFixed(2) ?? "0.00"}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`status-badge status-${status}`}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link to={`/admin/orders/${record.id}`}>
          <Button type="link" size="small">
            View
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div className="admin-dashboard" style={{ marginLeft: "250px" }}>
      <Title level={2}>Dashboard</Title>

      <div className="dashboard-cards">
        <Card>
          <Statistic
            title="Total Products"
            value={stats.products}
            prefix={<ShoppingOutlined className="dashboard-card-icon" />}
          />
          <div style={{ marginTop: 16 }}>
            <Link to="/admin/products">
              <Button type="primary" size="small">
                Manage Products
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <Statistic
            title="Total Categories"
            value={stats.categories}
            prefix={<TagsOutlined className="dashboard-card-icon" />}
          />
          <div style={{ marginTop: 16 }}>
            <Link to="/admin/categories">
              <Button type="primary" size="small">
                Manage Categories
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <Statistic
            title="Total Orders"
            value={stats.orders}
            prefix={<FileOutlined className="dashboard-card-icon" />}
          />
          <div style={{ marginTop: 16 }}>
            <Link to="/admin/orders">
              <Button type="primary" size="small">
                View Orders
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <Statistic
            title="Registered Users"
            value={stats.users}
            prefix={<UserOutlined className="dashboard-card-icon" />}
          />
          <div style={{ marginTop: 16 }}>
            <Link to="/admin/users">
              <Button type="primary" size="small">
                View Users
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="dashboard-table-header">
        <Title level={4}>Recent Orders</Title>
        <Link to="/admin/orders">
          <Button type="link">View All Orders</Button>
        </Link>
      </div>

      <Table columns={columns} dataSource={recentOrders} rowKey="id" loading={loading} pagination={false} />
    </div>
  )
}

export default AdminDashboard
