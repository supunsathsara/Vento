import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();



  const handleLogout = () => {
   console.log("Logout");
   toast({
      title: "Logged out",
      description: "You have been logged out",
   })
    navigate("/");
  };

  return (
    <Button onClick={handleLogout} variant="ghost" className="flex items-center">
      <LogOut className="h-6 w-6 mr-2" />
      Logout
    </Button>
  );
};

export default Logout;