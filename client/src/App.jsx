import "./App.css";
import Header from "./components/layout/header";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import EventsList from "./pages/events";
import CreateEvent from "./pages/events/create";

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
    {
      path: "/cadastro",
      element: <Register />,
    },
    {
      path: "/eventos",
      element: <EventsList />,
    },
    {
      path: "/eventos/novo",
      element: <CreateEvent />,
    },
    {
      path: "/eventos/:id/editar",
      element: <CreateEvent />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
