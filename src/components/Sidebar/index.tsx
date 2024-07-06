import {
  AppstoreOutlined,
  CalendarOutlined,
  RocketOutlined,
} from "@ant-design/icons";

import { Menu, ConfigProvider } from "antd";
import type { GetProp, MenuProps } from "antd";
import { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

type MenuItem = GetProp<MenuProps, "items">[number];

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(window.localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const location = useLocation();

  const handleLogout = () => {
    window.localStorage.removeItem("user");
    navigate("/login");
  };

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
    {
      key: "logout",
      icon: <RocketOutlined style={{ zoom: 1.7 }} />,
      label: <span className="text-2xl">Logout</span>,
      onClick: handleLogout,
    },
  ];

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
