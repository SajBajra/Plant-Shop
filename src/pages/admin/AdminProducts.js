"use client"

import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  Image,
  Popconfirm,
  message,
} from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { productService, categoryService } from "../../services/api"

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState("Add Product")
  const [form] = Form.useForm()
  const [editingProductId, setEditingProductId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
      ])

      setProducts(productsData)
      setCategories(categoriesData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      message.error("Failed to load data")
      setLoading(false)
    }
  }

  const showAddModal = () => {
    setModalTitle("Add Product")
    setEditingProductId(null)
    form.resetFields()
    setModalVisible(true)
  }

  const showEditModal = (product) => {
    setModalTitle("Edit Product")
    setEditingProductId(product.id)
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      categoryId: product.categoryId,
    })
    setModalVisible(true)
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (editingProductId) {
        // Update existing product
        await productService.updateProduct(editingProductId, values)
        message.success("Product updated successfully")
      } else {
        // Create new product
        await productService.createProduct(values)
        message.success("Product added successfully")
      }

      setModalVisible(false)
      fetchData()
    } catch (error) {
      console.error("Error saving product:", error)
      message.error("Failed to save product")
    }
  }

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id)
      message.success("Product deleted successfully")
      fetchData()
    } catch (error) {
      console.error("Error deleting product:", error)
      message.error("Failed to delete product")
    }
  }

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image src={image || "/placeholder.svg"} alt="Product" width={60} height={60} style={{ objectFit: "cover" }} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId) => {
        const category = categories.find((c) => c.id === categoryId)
        return category ? category.name : "Uncategorized"
      },
      filters: categories.map((c) => ({ text: c.name, value: c.id })),
      onFilter: (value, record) => record.categoryId === value,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small" className="table-actions">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} type="primary" size="small" />
          <Popconfirm
            title="Delete this product?"
            description="Are you sure you want to delete this product?"
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
    <div className="admin-products" style={{ marginLeft: "250px" }}>
      <div className="page-header">
        <Title level={2} className="page-title">
          Products
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          Add Product
        </Button>
      </div>

      <Table columns={columns} dataSource={products} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

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
        width={600}
      >
        <Form form={form} layout="vertical" name="productForm">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price ($)" rules={[{ required: true, message: "Please enter price" }]}>
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}>
            <Select placeholder="Select a category">
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}>
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="image" label="Image URL" rules={[{ required: true, message: "Please enter image URL" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminProducts
