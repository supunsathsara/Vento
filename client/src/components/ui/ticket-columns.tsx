import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ticket } from "@/types/index";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import ActivateTicket from "../ActivateTicket";

export const ticketColumns: ColumnDef<Ticket>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Ticket ID",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "customerEmail",
    header: "Email",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "purchaseDate",
    header: "Purchase Date",
    cell: ({ row }) => {
      const ticket = row.original;
      return (
        <div className="text-sm">
          {new Date(ticket.purchaseDate).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`
          font-medium
          ${status === "paid" ? "text-green-500" : ""}
          ${status === "pending" ? "text-yellow-500" : ""}
          ${status === "failed" ? "text-red-500" : ""}
        `}
        >
          {status.toUpperCase()}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original;

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
              onClick={() => navigator.clipboard.writeText(ticket.id)}
            >
              Copy Ticket ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(ticket.customerEmail)
              }
            >
              Copy Customer Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
           <ActivateTicket ticketId={ticket.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
