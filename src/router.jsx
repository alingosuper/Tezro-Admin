import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "./screens/Admin/AdminDashboard";
import AdminLogin from "./screens/Auth/AdminLogin";
import LivePerformance from "../screens/Admin/LivePerformance";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminDashboard />, // اب ہوم پیج پر ڈیش بورڈ کھلے گا
  },
  {
    path: "/login",
    element: <AdminLogin />,
  },
  {
    path: "/live",
    element: <LivePerformance />,
  }
]);

export default router;
