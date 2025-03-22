import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import Settings from "./pages/AccountLayout/Account/Settings/Settings";
import AccountLayout from "./pages/AccountLayout/AccountLayout";
import Account from "./pages/AccountLayout/Account/Account";
import Coin from "./pages/Home/Coin/Coin";
import EditProfile from "./pages/AccountLayout/Account/EditProfile/EditProfile";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import Registration from "./pages/Auth/Registration";
import Login from "./pages/Auth/Login";
import { lazy, Suspense } from "react";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const LazyNotFound = lazy(() => import("./pages/NotFound/NotFound"));

export default function AppRotes() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: ":coin",
          element: <Coin />,
        },
        {
          path: "account",
          element: (
            <PrivateRoute>
              <AccountLayout />
            </PrivateRoute>
          ),
          children: [
            {
              index: true,
              element: <Account />,
            },
            {
              path: "edit",
              element: <EditProfile />,
            },
            {
              path: "settings",
              element: <Settings />,
            },
          ],
        },
        {
          path: "*",
          element: (
            <Suspense fallback={<h1>Loading...</h1>}>
              <LazyNotFound />
            </Suspense>
          ),
        },
        {
          path: "registration",
          element: <Registration />,
        },
        {
          path: "login",
          element: <Login />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
