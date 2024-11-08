import { useNavigate } from "react-router-dom";
import Logout from "@/components/Logout";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { eventColumns } from "@/components/ui/event-columns";
import { EventTable } from "@/components/ui/event-table";
import { Event } from "@/types";

const VendorDashboard = () => {
  const navigate = useNavigate();

  const dummyEvents: Event[] = [
    {
      id: "1",
      name: "Summer Music Festival",
      date: "2024-07-15",
      time: "18:00",
      price: 49.99,
      availableTickets: 500,
      location: "Central Park",
      category: "Music",
    },
    {
      id: "2",
      name: "Tech Conference 2024",
      date: "2024-08-20",
      time: "09:00",
      price: 299.99,
      availableTickets: 200,
      location: "Convention Center",
      category: "Conference",
    },
    {
      id: "3",
      name: "Comedy Night Special",
      date: "2024-06-30",
      time: "20:00",
      price: 25.00,
      availableTickets: 100,
      location: "Laugh Factory",
      category: "Entertainment",
    },
  ];

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
          <p className="text-3xl font-bold">{dummyEvents.length}</p>
        </div>
        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Available Tickets</h3>
          <p className="text-3xl font-bold">
            {dummyEvents.reduce((sum, event) => sum + event.availableTickets, 0)}
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">
            Rs. {dummyEvents.reduce((sum, event) => sum + (event.price * (500 - event.availableTickets)), 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Events</h2>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => navigate('/vendor/1/events/create')}
        >
          Create New Event
        </Button>
      </div>

      <div className="bg-card rounded-lg p-6">
        <EventTable columns={eventColumns} data={dummyEvents} />
      </div>
    </div>
  );
};

export default VendorDashboard;
