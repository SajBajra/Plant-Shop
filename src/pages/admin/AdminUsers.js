import { useState, useEffect } from "react"
import { Table, Button, Modal, Typography, Descriptions, Tag, message } from "antd"
import { EyeOutlined } from "@ant-design/icons"
import { userService } from "../../services/api"

const { Title } = Typography

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getUsers()
      setUsers(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      message.error("Failed to load users")
      setLoading(false)
    }
  }

  const showUserDetails = (user) => {
    setSelectedUser(user)
    setDetailsVisible(true)
  }

  const getRoleTag = (isAdmin) => {
    return isAdmin ? <Tag color="green">Admin</Tag> : <Tag color="blue">Customer</Tag>
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin) => getRoleTag(isAdmin),
      filters: [
        { text: "Admin", value: true },
        { text: "Customer", value: false },
      ],
      onFilter: (value, record) => record.isAdmin === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => showUserDetails(record)} type="primary" size="small">
          View
        </Button>
      ),
    },
  ]

  return (
    <div className="admin-users" style={{ marginLeft: '250px' }}>
      <div className="page-header">
        <Title level={2} className="page-title">
          Users
        </Title>
      </div>

      <Table columns={columns} dataSource={users} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

      <Modal
        title="User Details"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{selectedUser.id}</Descriptions.Item>
            <Descriptions.Item label="First Name">{selectedUser.firstName}</Descriptions.Item>
            <Descriptions.Item label="Last Name">{selectedUser.lastName}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Role">{getRoleTag(selectedUser.isAdmin)}</Descriptions.Item>
            <Descriptions.Item label="Account Created">
              {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "N/A"}
            </Descriptions.Item>
          </Descriptions>
        )}

        <div
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: "#fffbe6",
            borderRadius: 4,
            borderLeft: "4px solid #faad14",
          }}
        >
          <p style={{ margin: 0 }}>
            Note: For security and privacy reasons, user information can only be viewed, not modified through this
            interface.
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default AdminUsers
