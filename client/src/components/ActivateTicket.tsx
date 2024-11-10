/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import { tickets } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface ActivateTicketProps {
  ticketId: string
}

const ActivateTicket = ({ ticketId }: ActivateTicketProps) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => tickets.updateStatus(ticketId, 'paid'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      toast({
        title: 'Success',
        description: 'Ticket has been activated',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to activate ticket',
        variant: 'destructive',
      })
    },
  })

  return (
    <Button
      variant={mutation.isPending ? "ghost" : "default"}
      className="h-8 w-full p-0"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Activating..." : "Activate Ticket"}
    </Button>
  )
}

export default ActivateTicket