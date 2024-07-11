import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, ConfigProvider } from "antd";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <header className="bg-[#001529] h-[50px] text-white w-full flex items-center px-8">
      <ConfigProvider
        theme={{
          components: {
            Breadcrumb: { linkColor: "#fff", itemColor: "#fff" },
          },
        }}
      >
        <Breadcrumb
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              href: location.pathname,
              title: (
                <span className="capitalize">{location.pathname.slice(1)}</span>
              ),
            },
          ]}
        />
      </ConfigProvider>
    </header>
  );
}
