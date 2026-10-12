import "./App.css";
import Header from "./components/layout/header";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/login";
import EventsList from "./pages/EventsList";
import Volunteers from "./pages/Volunteers";

function App() {
  const router = createBrowserRouter([
    //   {
    //     path: "/",
    //     element: <App />,
    //     // errorElement: <p>erro :</p>,
    //     children: [
    //       {
    //         path: "/",
    //         element: <Header />,
    //       },
    //       {
    //         path: "/events",
    //         element: <EventsList />,
    //       },
    //       {
    //         path: "/volunteers",
    //         element: <Volunteers />,
    //       },
    //     ],
    //   },
    //   {
    //     path: "/login",
    //     element: <Login />,
    //   },
    // ]);
    {
      path: "/",
      element: <Header />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/eventos",
      element: <EventsList />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
