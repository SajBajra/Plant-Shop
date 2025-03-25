"use client"

import { useState, useEffect } from "react"
import { Table, Button, Space, Modal, Form, Input, Typography, Popconfirm, message } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { categoryService } from "../../services/api"

const { Title } = Typography

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState("Add Category")
  const [form] = Form.useForm()
  const [editingCategoryId, setEditingCategoryId] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryService.getCategories()
      setCategories(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching categories:", error)
      message.error("Failed to load categories")
      setLoading(false)
    }
  }

  const showAddModal = () => {
    setModalTitle("Add Category")
    setEditingCategoryId(null)
    form.resetFields()
    setModalVisible(true)
  }

  const showEditModal = (category) => {
    setModalTitle("Edit Category")
    setEditingCategoryId(category.id)
    form.setFieldsValue({
      name: category.name,
    })
    setModalVisible(true)
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (editingCategoryId) {
        // Update existing category
        await categoryService.updateCategory(editingCategoryId, values)
        message.success("Category updated successfully")
      } else {
        // Create new category
        await categoryService.createCategory(values)
        message.success("Category added successfully")
      }

      setModalVisible(false)
      fetchCategories()
    } catch (error) {
      console.error("Error saving category:", error)
      message.error("Failed to save category")
    }
  }

  const handleDelete = async (id) => {
    try {
      await categoryService.deleteCategory(id)
      message.success("Category deleted successfully")
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      message.error("Failed to delete category")
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small" className="table-actions">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} type="primary" size="small" />
          <Popconfirm
            title="Delete this category?"
            description="Are you sure you want to delete this category? This may affect products assigned to this category."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="admin-categories" style={{ marginLeft: "250px" }}>
      <div className="page-header">
        <Title level={2} className="page-title">
          Categories
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          Add Category
        </Button>
      </div>

      <Table columns={columns} dataSource={categories} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

      <Modal
        title={modalTitle}
        open={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="categoryForm">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminCategories
