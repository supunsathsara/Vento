import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

//! Dummy data
const dummyEvents: Record<string, Event> = {
  "1": {
    id: "1",
    name: "Summer Music Festival",
    date: "2024-07-15",
    time: "18:00",
    price: 49.99,
    availableTickets: 500,
    location: "Central Park",
    category: "Music",
  },
};

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    quantity: 1,
  });

  const event = dummyEvents[eventId || ""];

  if (!event) {
    return <div className="text-white p-8">Event not found</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //! Generate random ticket number for Now
    const ticketId = Math.floor(Math.random() * 1000000);

    toast({
      title: "Purchase Successful!",
      description: `Your ticket number is: ${ticketId}`,
    });

    // Redirect to ticket page
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
          <div className="grid gap-4 text-gray-300">
            <p>
              Date: {new Date(event.date).toLocaleDateString()} at {event.time}
            </p>
            <p>Location: {event.location}</p>
            <p>Category: {event.category}</p>
            <p className="text-purple-500 text-xl">
              Price: ${event.price.toFixed(2)}
            </p>
            <p>Available Tickets: {event.availableTickets}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Purchase Tickets</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Name</label>
              <Input
                required
                className="bg-gray-800 text-white"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <Input
                required
                type="email"
                className="bg-gray-800 text-white"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-2">Quantity</label>
              <Input
                required
                type="number"
                min="1"
                max={event.availableTickets}
                className="bg-gray-800 text-white"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Purchase Tickets
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
