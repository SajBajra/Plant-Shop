import { useState, useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router"
import { Layout, Menu, theme } from "antd"
import { DashboardOutlined, ShoppingOutlined, FileOutlined, UserOutlined, TagsOutlined } from "@ant-design/icons"
import "./Admin.css"

const { Header, Content, Footer, Sider } = Layout

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState("dashboard")

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  useEffect(() => {
    const path = location.pathname.split("/").pop() || "dashboard"
    if (selectedKey !== path) {
      setSelectedKey(path)
    }
  }, [location.pathname, selectedKey])

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: "Products",
    },
    {
      key: "categories",
      icon: <TagsOutlined />,
      label: "Categories",
    },
    {
      key: "orders",
      icon: <FileOutlined />,
      label: "Orders",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
    },
  ]

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="admin-sider"
        style={{ marginTop: '60px' }} // Added margin-top here
      >
        <div className="admin-logo">{collapsed ? "PS" : "Plant Shop Admin"}</div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          onClick={({ key }) => navigate(`/admin/${key === "dashboard" ? "" : key}`)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "16px", padding: "24px", background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
