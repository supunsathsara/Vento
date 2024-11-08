import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Event } from "@/types/index";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const eventColumns: ColumnDef<Event>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Event ID",
  },
  {
    accessorKey: "name",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return <div className="font-medium">Rs. {price.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "availableTickets",
    header: "Available Tickets",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className={`font-medium ${event.availableTickets < 10 ? 'text-red-500' : ''}`}>
          {event.availableTickets}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date & Time",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="text-sm">
          {new Date(event.date).toLocaleDateString()} at {event.time}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(event.id)}
            >
              Copy Event ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(event.name)}
            >
              Copy Title
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              Edit Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];