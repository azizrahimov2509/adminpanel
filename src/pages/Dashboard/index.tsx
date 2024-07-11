import { Card, Col, Row, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../farebase/config";

type Product = {
  category: string;
  count: number;
};

export default function Dashboard() {
  const [productsByCategory, setProductsByCategory] = useState<
    { category: string; count: number }[]
  >([]);
  const [newOrders] = useState(93);
  const [revenue] = useState(112893);

  useEffect(() => {
    fetchProductCounts();
  }, []);

  const fetchProductCounts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const categoryCounts: { [key: string]: number } = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Product;
      if (data.category && data.count && data.count > 0) {
        categoryCounts[data.category] =
          (categoryCounts[data.category] || 0) + data.count;
      }
    });

    const sortedProductsByCategory = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => a.category.localeCompare(b.category));

    setProductsByCategory(sortedProductsByCategory);
  };

  return (
    <div className="p-4 text-white">
      <h2 className="mb-4">Dashboard</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title={<span className="text-black text-lg">Active Users</span>}
              value={1128}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={<span className="text-black text-lg">New Orders</span>}
              value={newOrders}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title={<span className="text-black text-lg">Revenue</span>}
              value={revenue}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>
      <div className="mt-4">
        <h3 className="mb-4">Product Count by Category</h3>
        <Row gutter={16}>
          {productsByCategory.length > 0 ? (
            productsByCategory.map((item) => (
              <Col span={8} key={item.category}>
                <Card>
                  <Statistic
                    title={
                      <span className="text-black text-lg">
                        {item.category}
                      </span>
                    }
                    value={item.count}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Card>
                <p>No products available.</p>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
}
