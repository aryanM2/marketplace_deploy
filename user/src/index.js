import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import "bootstrap/dist/css/bootstrap.min.css";

import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  Outlet,
} from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";

import Home from "./components/Home";
import PostItem from "./components/PostItem";
import Mypost from "./components/Mypost";
import ViewItem from "./components/ViewItem";
import Category from "./components/Category";
import App from "./App";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ProtectedRoute checks for a token on route changes and updates parent auth state.
const ProtectedRoute = ({ setIsauthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
      setIsauthenticated(true);
      if (
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/signup"
      ) {
        navigate("/home", { replace: false });
      }
    } else {
      if (
        location.pathname === "/home" ||
        location.pathname === "/post-item" ||
        location.pathname === "/my-post" ||
        location.pathname === "/category/electronics" ||
        location.pathname === "/category/books" ||
        location.pathname === "/category/notes" ||
        location.pathname === "/category/stationary" ||
        location.pathname === "/view"
      ) {
        navigate("/login", { replace: false });
      }
    }
  }, [location, navigate, setIsauthenticated]);
  return null;
};

// Root layout renders ProtectedRoute so it runs inside the router context
function RootLayout() {
  const [isauthenticated, setIsauthenticated] = React.useState(false);
  return (
    <>
      <ProtectedRoute setIsauthenticated={setIsauthenticated} />
      <Outlet />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

let routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "home", element: <Home /> },
      { path: "post-item", element: <PostItem /> },
      { path: "my-post", element: <Mypost /> },
      { path: "view/:id", element: <ViewItem /> },
      { path: "category/:type", element: <Category /> },
    ],
  },
]);
root.render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
