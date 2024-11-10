import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { tickets } from "@/lib/api";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function TicketView() {
  const { ticketId } = useParams();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['tickets', ticketId],
    queryFn: () => tickets.getOne(ticketId!),
    enabled: !!ticketId
  });

  const ticketUrl = window.location.href;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(ticketUrl);
      setCopied(true);
      toast({
        title: "Success",
        description: "Ticket URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL", err);
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-white p-8">Loading ticket details...</div>;
  }

  if (!ticket) {
    return <div className="text-white p-8">Ticket not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-6">Your Ticket</h1>

          <div className="bg-gray-800 p-8 rounded-lg mb-8">
            <p className="text-2xl font-bold text-purple-500 mb-4">
              Ticket ID: {ticketId}
            </p>

            <div className="grid gap-4 text-left mb-4">
              <div>
                <p className="text-gray-400">Customer</p>
                <p className="font-semibold">{ticket.customerName}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="font-semibold">{ticket.customerEmail}</p>
              </div>
              <div>
                <p className="text-gray-400">Quantity</p>
                <p className="font-semibold">{ticket.quantity} tickets</p>
              </div>
              <div>
                <p className="text-gray-400">Purchase Date</p>
                <p className="font-semibold">
                  {new Date(ticket.purchaseDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p
                  className={`font-semibold ${
                    ticket.status === "paid"
                      ? "text-green-500"
                      : ticket.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {ticket.status.toUpperCase()}
                </p>
              </div>
            </div>

            <p className="text-gray-400 mt-4">
              Keep this ID safe - you'll need it for entry
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={handleCopyUrl}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {copied ? (
                <>
                  <CheckIcon className="mr-2" /> Copied!
                </>
              ) : (
                <>
                  <CopyIcon className="mr-2" /> Copy Ticket URL
                </>
              )}
            </Button>
          </div>

          <div className="mt-8 p-4 bg-gray-800 rounded text-sm text-gray-400">
            <p>Keep this URL to access your ticket:</p>
            <p className="mt-2 break-all">{ticketUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
}