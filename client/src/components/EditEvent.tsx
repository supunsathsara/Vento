/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { events } from "@/lib/api";
import { Event } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  price: z.number().min(0, "Price must be positive"),
  availableTickets: z.number().min(1, "Must have at least 1 ticket"),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
});

const EditEvent: React.FC<{ event: Event }> = ({ event }) => {
  const [name, setName] = useState(event.name);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [price, setPrice] = useState(event.price.toString());
  const [availableTickets, setAvailableTickets] = useState(event.availableTickets.toString());
  const [location, setLocation] = useState(event.location);
  const [category, setCategory] = useState(event.category);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedEvent: Partial<Event>) => {
      return events.update(event.id, updatedEvent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", "vendor"] });
      setOpen(false);
      toast({
        title: "Event Updated",
        description: "The event details have been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update event",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = eventSchema.safeParse({
      name,
      date,
      time,
      price: Number(price),
      availableTickets: Number(availableTickets),
      location,
      category,
    });

    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors
          .map((err) => err.message)
          .join(", "),
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(validation.data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-full p-0">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the details of <span className="font-semibold">{event.name}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tickets">Available Tickets</Label>
              <Input
                id="tickets"
                type="number"
                min="1"
                value={availableTickets}
                onChange={(e) => setAvailableTickets(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Updating..." : "Update Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEvent;
