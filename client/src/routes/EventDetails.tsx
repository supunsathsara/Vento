/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { events, tickets } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";

const purchaseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  quantity: z.number().min(1, "Must purchase at least 1 ticket"),
});

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: event, isLoading } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => events.getOne(eventId!),
    enabled: !!eventId,
  });

  const purchaseMutation = useMutation({
    mutationFn: (data: { name: string; email: string; quantity: number }) => 
      tickets.purchase({
        eventId: eventId!,
        customerName: data.name,
        customerEmail: data.email,
        quantity: data.quantity,
      }),
    onSuccess: (data) => {
      toast({
        title: "Purchase Successful!",
        description: `Your ticket ID is: ${data.ticket.id}`,
      });
      navigate(`/ticket/${data.ticket.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name: (e.target as any).name.value,
      email: (e.target as any).email.value,
      quantity: parseInt((e.target as any).quantity.value),
    };

    const validation = purchaseSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    purchaseMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (!event) {
    return <div className="text-white p-8">Event not found</div>;
  }

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
                name="name"
                required
                className="bg-gray-800 text-white"
                disabled={purchaseMutation.isPending}
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <Input
                name="email"
                type="email"
                required
                className="bg-gray-800 text-white"
                disabled={purchaseMutation.isPending}
              />
            </div>
            <div>
              <label className="block mb-2">Quantity</label>
              <Input
                name="quantity"
                type="number"
                min="1"
                max={event.availableTickets}
                defaultValue="1"
                required
                className="bg-gray-800 text-white"
                disabled={purchaseMutation.isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={purchaseMutation.isPending}
            >
              {purchaseMutation.isPending ? "Processing..." : "Purchase Tickets"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
