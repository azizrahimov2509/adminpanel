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
  // Add more activities here
];

export default function Dashboard() {
  return (
    <div className="p-4">
      <h2 className="mb-4">Dashboard</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Users"
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
              title="New Orders"
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
              title="Revenue"
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
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>
      <div className="mt-4">
        <h3>Quick Actions</h3>
        <Space>
          <Button type="primary" icon={<UserAddOutlined />}>
            Add User
          </Button>
          <Button type="primary" icon={<ShoppingCartOutlined />}>
            New Order
          </Button>
          <Button type="primary" icon={<SettingOutlined />}>
            Settings
          </Button>
        </Space>
      </div>
    </div>
  );
}
