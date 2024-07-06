import React, { useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(window.localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full bg-sky-900 text-white">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
