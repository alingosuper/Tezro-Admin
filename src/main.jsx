import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AdminDashboard from "./screens/Admin/AdminDashboard"
import AdminLogin from "./screens/Auth/AdminLogin"
import "./global.css"

const router = createBrowserRouter([
  { path: "/", element: <AdminDashboard /> },
  { path: "/login", element: <AdminLogin /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
