import "./App.css";
import Header from "./components/layout/header";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/login";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
