import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Radio,
  TableColumnType,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../farebase/config";

const { Option } = Select;

type Product = {
  key: string;
  name: string;
  price: number;
  category: string;
  color: string;
  gender: string;
  photo: string;
  description: string;
  size: "small" | "medium" | "large" | "XL" | "2XL" | "3XL";
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setTableLoading(true);
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData: Product[] = [];
    querySnapshot.forEach((doc) => {
      productsData.push({ key: doc.id, ...doc.data() } as Product);
    });
    setProducts(productsData);
    saveProductsToLocal(productsData);
    setTableLoading(false);
  };

  const saveProductsToLocal = (products: Product[]) => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  const loadProductsFromLocal = () => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  };

  useEffect(() => {
    loadProductsFromLocal();
  }, []);

  const handleDelete = async (key: string) => {
    setLoading(true);
    await deleteDoc(doc(db, "products", key));
    fetchProducts();
    setLoading(false);
  };

  const handleConfirmDelete = (key: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => handleDelete(key),
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const showAddModal = () => {
    setIsEdit(false);
    setCurrentProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (product: Product) => {
    setIsEdit(true);
    setCurrentProduct(product);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    const values = await form.validateFields();
    setLoading(true);
    if (isEdit && currentProduct) {
      await updateDoc(doc(db, "products", currentProduct.key), values);
    } else {
      await addDoc(collection(db, "products"), values);
    }
    setIsModalOpen(false);
    form.resetFields();
    fetchProducts();
    setLoading(false);
  };

  const columns: TableColumnType<Product>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record: Product) =>
        record.name.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text: number) => `$${text}`,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (text: string) => (
        <img src={text} alt="product" style={{ width: 50 }} />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (size: "small" | "medium" | "large" | "XL" | "2XL" | "3XL") => (
        <span>{size}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Button
            icon={<DeleteOutlined className="text-red-500" />}
            onClick={() => handleConfirmDelete(record.key)}
            loading={loading}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 text-white">
      <h2 className="mb-4">Products</h2>
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search products"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          className="w-1/3"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
          loading={loading}
        >
          Add Product
        </Button>
      </div>
      <Table columns={columns} dataSource={products} loading={tableLoading} />

      <Modal
        title={isEdit ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onOk={handleSaveProduct}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input
              type="number"
              prefix="$" // Добавляем $ как префикс
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please input the category!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please input the color!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select the gender!" }]}
          >
            <Radio.Group>
              <Radio value="men">Men</Radio>
              <Radio value="women">Women</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="photo"
            label="Photo URL"
            rules={[{ required: true, message: "Please input the photo URL!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="size"
            label="Size"
            rules={[{ required: true, message: "Please select the size!" }]}
          >
            <Select placeholder="Select a size">
              <Option value="small">Small</Option>
              <Option value="medium">Medium</Option>
              <Option value="large">Large</Option>
              <Option value="Xl">XL</Option>
              <Option value="2Xl">2XL</Option>
              <Option value="3Xl">3XL</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
