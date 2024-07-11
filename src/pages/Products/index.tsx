import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Radio,
  Select,
  Upload,
  TableColumnType,
  message,
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../farebase/config";
import ImgCrop from "antd-img-crop";

const { Option } = Select;

type Product = {
  key: string;
  name: string;
  price: number;
  category: string;
  color: string;
  gender: string;
  photo: string[];
  description: string;
  size: "small" | "medium" | "large" | "XL" | "2XL" | "3XL";
  count: number; // Новое поле для количества товаров
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setTableLoading(true);
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData: Product[] = [];
    querySnapshot.forEach((doc) => {
      productsData.push({
        key: doc.id,
        ...doc.data(),
        photo: doc.data().photo || [],
        count: doc.data().count || 0, // Извлечение количества товаров
      } as Product);
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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const showAddModal = () => {
    setIsEdit(false);
    setCurrentProduct(null);
    form.resetFields();
    setFileList([]);
    setIsModalOpen(true);
  };

  const showEditModal = (product: Product) => {
    setIsEdit(true);
    setCurrentProduct(product);
    form.setFieldsValue(product);
    setFileList(
      product.photo.map((url, index) => ({
        uid: index.toString(),
        name: `image${index}.png`,
        status: "done",
        url,
      }))
    );
    setIsModalOpen(true);
  };

  const handleUpload = async (file: any) => {
    const storage = getStorage();
    const storageRef = ref(storage, `products/` + file.name);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSaveProduct = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);

      let photoURLs = currentProduct ? currentProduct.photo : [];

      if (fileList.length > 0) {
        const uploadPromises = fileList
          .filter((file) => !file.url && file.originFileObj)
          .map((file) => handleUpload(file.originFileObj));
        const uploadedPhotoURLs = await Promise.all(uploadPromises);
        photoURLs = [...photoURLs, ...uploadedPhotoURLs];
      }

      const productData = { ...values, photo: photoURLs, count: values.count };

      if (isEdit && currentProduct) {
        await updateDoc(doc(db, "products", currentProduct.key), productData);
      } else {
        await addDoc(collection(db, "products"), productData);
      }

      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      fetchProducts();
    } catch (error) {
      console.error("Validation Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: (file: any) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} is not an image file.`);
        return Upload.LIST_IGNORE;
      }
      setFileList((prev) => [...prev, file]);
      return false;
    },
    fileList,
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
      render: (
        category: "T-shirt" | "Jeans" | "Smoking" | "Jackets" | "Dress" | "Cap"
      ) => <span>{category}</span>,
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
      title: "Count",
      dataIndex: "count",
      key: "count",
      render: (count: number) => <span>{count}</span>,
    },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photos: string[]) => (
        <div
          style={{
            display: "flex",
            justifyContent: photos.length === 1 ? "center" : "flex-start",
            gap: 8,
          }}
        >
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt="product"
              style={{ width: 50, height: 50, objectFit: "contain" }}
            />
          ))}
        </div>
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

  const filteredProducts = products.filter((product) => {
    return (
      (selectedCategory === "all" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className="p-4 text-white">
      <h2 className="mb-4">Products</h2>
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Search products"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          className="w-full md:w-1/3"
        />
        <Select
          placeholder="Select a category"
          className="w-full md:w-1/3"
          onChange={handleCategoryChange}
          value={selectedCategory}
        >
          <Option value="all">All</Option>
          <Option value="t-shirt">T-shirt</Option>
          <Option value="jeans">Jeans</Option>
          <Option value="smoking">Smoking</Option>
          <Option value="jackets">Jackets</Option>
          <Option value="dress">Dress</Option>
          <Option value="Cap">Cap</Option>
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
          loading={loading}
        >
          Add Product
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredProducts}
        loading={tableLoading}
      />

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
            <Input type="number" prefix="$" min={0} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please input the category!" }]}
          >
            <Select placeholder="Select a category">
              <Option value="t-shirt">T-shirt</Option>
              <Option value="jeans">Jeans</Option>
              <Option value="smoking">Smoking</Option>
              <Option value="jackets">Jackets</Option>
              <Option value="dress">Dress</Option>
              <Option value="Cap">Cap</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please input the color!" }]}
          >
            <Input type="color" />
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
            name="count"
            label="Count"
            rules={[{ required: true, message: "Please input the count!" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item name="photo" label="Photo">
            <ImgCrop rotationSlider>
              <Upload
                {...uploadProps}
                listType="picture-card"
                onChange={({ fileList: newFileList }) =>
                  setFileList(newFileList)
                }
                onPreview={async (file) => {
                  let src = file.url as string;
                  if (!src) {
                    src = await new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file.originFileObj as File);
                      reader.onload = () => resolve(reader.result as string);
                    });
                  }
                  const image = new Image();
                  image.src = src;
                  const imgWindow = window.open(src);
                  imgWindow?.document.write(image.outerHTML);
                }}
              >
                {fileList.length < 5 && "+ Upload"}
              </Upload>
            </ImgCrop>
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
              <Option value="XL">XL</Option>
              <Option value="2XL">2XL</Option>
              <Option value="3XL">3XL</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
