import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import NotFound from "./routes/NotFound.tsx";
import Root from "./routes/Root.tsx";
import { Toaster } from "@/components/ui/toaster";
import Browse from "./routes/Browse.tsx";
import EventDetails from "./routes/EventDetails.tsx";
import TicketView from "./routes/TicketView.tsx";
import VendorDashboard from "./routes/VendorDashboard.tsx";
import AuthLayout from "./routes/AuthLayout.tsx";
import Login from "./routes/Login.tsx";
import Register from "./routes/Register.tsx";
import EventManage from "./routes/EventManage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/events",
    element: <Browse />,
  },
  {
    path: "/events/:eventId",
    element: <EventDetails />,
  },
  {
    path: "/ticket/:ticketId",
    element: <TicketView />,
  },
  {
    path: "/vendor",
    element: <VendorDashboard />,
  },
  {
    path: "/vendor/:eventId",
    element: <EventManage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
