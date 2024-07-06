import { AppstoreOutlined, CalendarOutlined } from "@ant-design/icons";
import { Menu, ConfigProvider } from "antd";
import type { GetProp, MenuProps } from "antd";
import { NavLink, useLocation } from "react-router-dom";

type MenuItem = GetProp<MenuProps, "items">[number];

const items: MenuItem[] = [
  {
    key: "title",
    label: <h2 className="text-white text-center text-xl py-2">FN20</h2>,
    disabled: true,
  },
  {
    key: "dashboard",
    icon: <AppstoreOutlined style={{ zoom: 1.7 }} />,
    label: (
      <NavLink className="text-2xl" to="/dashboard">
        Dashboard
      </NavLink>
    ),
  },
  {
    key: "products",
    icon: <CalendarOutlined style={{ zoom: 1.7 }} />,
    label: (
      <NavLink className="text-2xl" to="/products">
        Products
      </NavLink>
    ),
  },
  //   {
  //     key: "sub1",
  //     icon: <MailOutlined />,
  //     label: <NavLink to="/dashboard">Dashboard</NavLink>,
  //   },
  //   {
  //     key: "sub2",
  //     icon: <SettingOutlined />,
  //     label: <NavLink to="/dashboard">Dashboard</NavLink>,
  //   },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <>
      <ConfigProvider theme={{ components: { Menu: { itemHeight: 70 } } }}>
        <Menu
          style={{ width: 350, height: "100vh" }}
          defaultSelectedKeys={[location.pathname.slice(1)]}
          items={items}
          theme="dark"
        />
      </ConfigProvider>
    </>
  );
}
