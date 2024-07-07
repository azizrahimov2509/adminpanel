import { Table, Button, Space, Input, TableColumnType } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";

type Product = {
  key: string;
  name: string;
  price: string;
  category: string;
};

const initialProducts: Product[] = [
  {
    key: "1",
    name: "Product 1",
    price: "$10",
    category: "Category 1",
  },
  {
    key: "2",
    name: "Product 2",
    price: "$20",
    category: "Category 2",
  },
  {
    key: "3",
    name: "Product 3",
    price: "$37",
    category: "Category 3",
  },
  {
    key: "4",
    name: "Product 4",
    price: "$42",
    category: "Category 24",
  },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchText, setSearchText] = useState<string>("");

  const handleDelete = (key: string) => {
    const newProducts = products.filter((product) => product.key !== key);
    setProducts(newProducts);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const columns: TableColumnType<Product>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchText],
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
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} />
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
        <Button type="primary" icon={<PlusOutlined />}>
          Add Product
        </Button>
      </div>
      <Table columns={columns} dataSource={products} />
    </div>
  );
}
