import Logout from "@/components/Logout";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { ticketColumns } from "@/components/ui/ticket-columns";
import { TicketTable } from "@/components/ui/ticket-table";
import { events, tickets } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EventManage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["events", eventId],
    queryFn: () => events.getOne(eventId!),
    enabled: !!eventId,
  });

  const { data: eventTickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ["tickets", "event", eventId],
    queryFn: () => tickets.getByEventId(eventId!),
    enabled: !!eventId,
  });

  if (eventLoading || ticketsLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!event) {
    return <div className="p-8">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-primary-foreground p-8">
      <header className="mb-8 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/vendor")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-4xl font-bold">Manage Event</h1>
        <div className="flex gap-3">
          <ThemeSwitcher />
          <Logout />
        </div>
      </header>
      <div className="max-w-6xl mx-auto">
        <div className="rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400">Date</p>
              <p className="font-semibold">
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Time</p>
              <p className="font-semibold">{event.time}</p>
            </div>
            <div>
              <p className="text-gray-400">Location</p>
              <p className="font-semibold">{event.location}</p>
            </div>
            <div>
              <p className="text-gray-400">Category</p>
              <p className="font-semibold">{event.category}</p>
            </div>
            <div>
              <p className="text-gray-400">Price</p>
              <p className="font-semibold text-purple-500">
                ${event.price.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Available Tickets</p>
              <p className="font-semibold">{event.availableTickets}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Sales</p>
              <p className="font-semibold">
                {eventTickets?.filter((t) => t.status === "paid").length || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Revenue</p>
              <p className="font-semibold text-green-500">
                $
                {(
                  eventTickets
                    ?.filter((t) => t.status === "paid")
                    .reduce((acc, t) => acc + t.quantity * event.price, 0) || 0
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className=" rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Tickets</h2>
          <TicketTable columns={ticketColumns} data={eventTickets || []} />
        </div>
      </div>
    </div>
  );
};

export default EventManage;
