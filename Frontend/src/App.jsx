import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './Admin/Register';
import Login from './Admin/Login';
import ErrorPage from './Admin/ErrorPage';
import "./App.css";
import MainPage from './Layout/MainPage';
import PageEditor from './Pages/Home';
import PageStructure from './Pages/Dynamic';
import IsAuth from './Admin/IsAuth';
import { useEffect, useState } from 'react';
import Geast from './Admin/Geast';
import MenuManager from './Pages/Header_and_footer';
import Other from '../src/Pages/Other';
import AdminProfile from './Admin/AdminProfile';
import PasswordForgot from './Admin/PasswordForgot';
import NewPassword from './Admin/NewPassword';
import StyleForm from './Pages/StyleSetting';

const App = () => {
  const [dynamicRoute, setDynamicRoute] = useState([]);

  useEffect(() => {
    const fetchDynamicRoutes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getData`);
        const data = await response.json();
        console.log("Dynamic Routes Data:", data);

        if (data.success && Array.isArray(data.data)) {
          setDynamicRoute(data.data);
        } else {
          setDynamicRoute([]);
        }
      } catch (error) {
        console.error("Error fetching dynamic routes:", error);
        setDynamicRoute([]);
      }
    };
    fetchDynamicRoutes();
  }, []);

  const router = createBrowserRouter([
    // Public Admin Routes (Register/Login)
    { path: "/admin/register", element: <Geast><Register /></Geast> },
    { path: "/admin/login", element: <Geast><Login /></Geast> },
    { path: "/forgot-password", element: <PasswordForgot /> },
    { path: "/new-password", element: <NewPassword /> },


    // Dynamic Public Routes
    ...dynamicRoute.map(r => ({
      path: `/${r.page}`,
      element: <PageStructure page={r} />
    })),
    // Protected Admin Dashboard Routes
    {
      path: "/",
      element: <IsAuth><MainPage /></IsAuth>,
      children: [
        { path: "*", element: <ErrorPage /> },
        { path: "/", element: <PageEditor /> },
        { path: "/admin/profile", element: <AdminProfile /> },
        { path: "/pageselect", element: <MenuManager /> },
        { path: "/other", element: <Other /> },
        { path: "/stylesetting", element: <StyleForm /> },


      ],
    },

    // Catch-all for unknown paths
    { path: "*", element: <ErrorPage /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
