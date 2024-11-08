import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TicketDetails } from "@/types";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useParams } from "react-router-dom";

//! Dummy data
const getDummyTicketData = (id: string): TicketDetails => ({
  id,
  customerName: "John Doe",
  email: "john.doe@example.com",
  paymentStatus: "paid",
  purchaseDate: new Date().toISOString(),
  eventName: "Summer Music Festival",
});

export default function TicketView() {
  const { ticketId } = useParams();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const ticketUrl = window.location.href;
  const ticketData = getDummyTicketData(ticketId || "");

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
      console.log(err);
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

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
                <p className="text-gray-400">Event</p>
                <p className="font-semibold">{ticketData.eventName}</p>
              </div>
              <div>
                <p className="text-gray-400">Customer</p>
                <p className="font-semibold">{ticketData.customerName}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="font-semibold">{ticketData.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Purchase Date</p>
                <p className="font-semibold">
                  {new Date(ticketData.purchaseDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Payment Status</p>
                <p
                  className={`font-semibold ${
                    ticketData.paymentStatus === "paid"
                      ? "text-green-500"
                      : ticketData.paymentStatus === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {ticketData.paymentStatus.toUpperCase()}
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
