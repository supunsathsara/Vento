import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { events } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types";

export default function Browse() {
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => events.getAll(),
  });

  const sortEvents = (events: Event[]): Event[] => {
    const filteredEvents = category === "all" 
      ? events 
      : events.filter(event => event.category.toLowerCase() === category);

    return [...filteredEvents].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "price":
          return a.price - b.price;
        case "availability":
          return b.availableTickets - a.availableTickets;
        default:
          return 0;
      }
    });
  };

  const sortedEvents = eventsData ? sortEvents(eventsData) : [];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Browse Events</h1>
          <div className="space-x-4 flex">
            <Select onValueChange={setCategory} defaultValue="all">
              <SelectTrigger className="w-[180px] bg-gray-800 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setSortBy} defaultValue="date">
              <SelectTrigger className="w-[180px] bg-gray-800 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
                <SelectItem value="availability">Sort by Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : sortedEvents.length === 0 ? (
            <div className="text-center py-8">No events found</div>
          ) : (
            sortedEvents.map((event) => (
              <div 
                key={event.id}
                className="bg-gray-900 p-6 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-bold mb-2">{event.name}</h2>
                  <p className="text-gray-400 mb-1">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                  <p className="text-gray-400 mb-1">{event.location}</p>
                  <p className="text-purple-500">
                    Rs. {event.price.toFixed(2)} • {event.availableTickets} tickets left
                  </p>
                </div>
                <div>
                  <Link to={`/events/${event.id}`}>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Buy Tickets
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}