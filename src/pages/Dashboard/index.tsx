import { Card, Col, Row, Statistic, List, Avatar, Button, Space } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserAddOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const recentActivities = [
  {
    title: "User JohnDoe created a new account",
    description: "2 hours ago",
  },
  {
    title: "Order #12345 has been shipped",
    description: "3 hours ago",
  },
  {
    title: "User JaneDoe updated her profile",
    description: "5 hours ago",
  },
  {
    title: "User Alice updated her profile",
    description: "5 hours ago",
  },
];

export default function Dashboard() {
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
              value={93}
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
              value={112893}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>
      <div className="mt-4">
        <h3>Recent Activity</h3>
        <List
          itemLayout="horizontal"
          dataSource={recentActivities}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<ArrowUpOutlined />} />}
                title={
                  <span className="text-green-500 text-lg">{item.title}</span>
                }
                description={
                  <span className="text-white">{item.description}</span>
                }
              />
            </List.Item>
          )}
        />
      </div>
      <div className="mt-4">
        <h3>Quick Actions</h3>
        <Space>
          <Button
            type="primary"
            className="text-white"
            icon={<UserAddOutlined />}
          >
            Add User
          </Button>
          <Button
            type="primary"
            className="text-white"
            icon={<ShoppingCartOutlined />}
          >
            New Order
          </Button>
          <Button
            type="primary"
            className="text-white"
            icon={<SettingOutlined />}
          >
            Settings
          </Button>
        </Space>
      </div>
    </div>
  );
}
