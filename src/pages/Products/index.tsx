import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Radio,
  TableColumnType,
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

type Product = {
  key: string;
  name: string;
  price: string;
  category: string;
  color: string;
  gender: string;
  photo: string;
  description: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData: Product[] = [];
    querySnapshot.forEach((doc) => {
      productsData.push({ key: doc.id, ...doc.data() } as Product);
    });
    setProducts(productsData);
    saveProductsToLocal(productsData); // Save to LocalStorage
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
    await deleteDoc(doc(db, "products", key));
    fetchProducts();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const showAddModal = () => {
    setIsEdit(false);
    setCurrentProduct(null);
    setIsModalVisible(true);
  };

  const showEditModal = (product: Product) => {
    setIsEdit(true);
    setCurrentProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleSaveProduct = async () => {
    const values = await form.validateFields();
    if (isEdit && currentProduct) {
      await updateDoc(doc(db, "products", currentProduct.key), values);
    } else {
      await addDoc(collection(db, "products"), values);
    }
    setIsModalVisible(false);
    form.resetFields();
    fetchProducts();
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
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
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
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          Add Product
        </Button>
      </div>
      <Table columns={columns} dataSource={products} />

      <Modal
        title={isEdit ? "Edit Product" : "Add Product"}
        visible={isModalVisible}
        onOk={handleSaveProduct}
        onCancel={() => setIsModalVisible(false)}
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
            <Input />
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
        </Form>
      </Modal>
    </div>
  );
}
