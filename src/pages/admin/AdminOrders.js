import { useState, useEffect } from "react"
import { Table, Button, Space, Modal, Typography, Select, Descriptions, Tag, Divider, message } from "antd"
import { EyeOutlined } from "@ant-design/icons"
import { orderService } from "../../services/api"

const { Title } = Typography
const { Option } = Select

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getOrders()
      setOrders(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      message.error("Failed to load orders")
      setLoading(false)
    }
  }

  const showOrderDetails = (order) => {
    setSelectedOrder(order)
    setDetailsVisible(true)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus)
      message.success("Order status updated successfully")

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      )

      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      message.error("Failed to update order status")
    }
  }

  const handleFilterChange = (value) => {
    setStatusFilter(value)
  }

  const getStatusTag = (status) => {
    const statusColors = {
      pending: "gold",
      shipped: "blue",
      delivered: "green",
      cancelled: "red",
    }

    return <Tag color={statusColors[status] || "default"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>
  }

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((order) => order.status === statusFilter)

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => `${customer.firstName} ${customer.lastName}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `$${total.toFixed(2)}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => showOrderDetails(record)} type="primary" size="small">
          View
        </Button>
      ),
    },
  ]

  return (
    <div className="admin-orders" style={{ marginLeft: '250px' }}>
      <div className="page-header">
        <Title level={2} className="page-title">
          Orders
        </Title>
        <Select defaultValue="all" style={{ width: 150 }} onChange={handleFilterChange} value={statusFilter}>
          <Option value="all">All Orders</Option>
          <Option value="pending">Pending</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="delivered">Delivered</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={`Order Details ${selectedOrder ? `#${selectedOrder.id}` : ""}`}
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedOrder && (
          <>
            <Descriptions title="Customer Information" bordered column={2}>
              <Descriptions.Item label="Name">
                {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrder.customer.email}</Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>
                {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state}{" "}
                {selectedOrder.customer.zipCode}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Order Information" bordered column={2}>
              <Descriptions.Item label="Order Date">{new Date(selectedOrder.date).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedOrder.paymentMethod === "credit" ? "Credit Card" : "PayPal"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Space>
                  {getStatusTag(selectedOrder.status)}
                  <Select
                    value={selectedOrder.status}
                    onChange={(value) => handleStatusChange(selectedOrder.id, value)}
                    style={{ width: 120 }}
                  >
                    <Option value="pending">Pending</Option>
                    <Option value="shipped">Shipped</Option>
                    <Option value="delivered">Delivered</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Total">${selectedOrder.total.toFixed(2)}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>Order Items</Title>
            <Table
              dataSource={selectedOrder.items}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: "Product",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Price",
                  dataIndex: "price",
                  key: "price",
                  render: (price) => `$${price.toFixed(2)}`,
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                },
                {
                  title: "Subtotal",
                  key: "subtotal",
                  render: (_, record) => `$${(record.price * record.quantity).toFixed(2)}`,
                },
              ]}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={3} style={{ textAlign: "right" }}>
                    <strong>Total:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <strong>${selectedOrder.total.toFixed(2)}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </>
        )}
      </Modal>
    </div>
  )
}

export default AdminOrders
