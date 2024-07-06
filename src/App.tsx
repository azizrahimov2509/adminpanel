import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Login from "./pages/Login";

const Redirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = JSON.parse(window.localStorage.getItem("user") || "false");

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <Redirect>
        <Layout />
      </Redirect>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={"/dashboard"} />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/products",
        element: <Products />,
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
