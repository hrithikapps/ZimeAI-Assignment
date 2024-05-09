import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./components/LandingPage";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    // errorElement: <Error />,
  },
]);

const AppLayout = () => {
  return <RouterProvider router={appRouter} />;
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppLayout />);
