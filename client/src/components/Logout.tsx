import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/api";

const Logout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    try {
      auth.logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Failed to logout", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="flex items-center"
    >
      <LogOut className="h-6 w-6 mr-2" />
      Logout
    </Button>
  );
};

export default Logout;
