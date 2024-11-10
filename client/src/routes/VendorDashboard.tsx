/* eslint-disable @typescript-eslint/no-explicit-any */
import Logout from "@/components/Logout";
import NewEvent from "@/components/NewEvent";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { eventColumns } from "@/components/ui/event-columns";
import { EventTable } from "@/components/ui/event-table";
import { useToast } from "@/hooks/use-toast";
import { events } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: vendorEvents,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["events", "vendor"],
    queryFn: () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        throw new Error("Not authenticated");
      }

      const decoded = jwtDecode<{ id: string; exp: number }>(token);
      //check for expired token
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        navigate("/login");
        throw new Error("Token expired");
      }
      return events.getAll({ vendorId: decoded.id });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast({
      title: "Error",
      description: "An error occurred. Please try again later.",
      variant: "destructive",
    });
  }

  const totalTickets =
    vendorEvents?.reduce((sum, event) => sum + event.availableTickets, 0) || 0;

  return (
    <div className="min-h-screen w-full bg-primary-foreground p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-purple-500">Vendor Dashboard</h1>
        <div className="flex gap-3">
          <ThemeSwitcher />
          <Logout />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Total Events</h3>
          <p className="text-3xl font-bold">{vendorEvents?.length || 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Available Tickets</h3>
          <p className="text-3xl font-bold">{totalTickets}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Events</h2>
        <NewEvent />
      </div>

      <div className="bg-card rounded-lg p-6">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <EventTable columns={eventColumns} data={vendorEvents || []} />
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
