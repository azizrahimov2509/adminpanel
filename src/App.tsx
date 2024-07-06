import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
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
  return <RouterProvider router={router} />;
}

export default App;
