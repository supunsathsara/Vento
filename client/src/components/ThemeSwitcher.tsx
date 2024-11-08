import React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

const ThemeSwitcher: React.FC = () => {
  const [theme, toggleTheme] = useTheme('light');

  return (
    <Button onClick={toggleTheme} variant="ghost" className="flex items-center">
      {theme === "light" ? (
        <Moon className="h-8 w-8 mr-2" />
      ) : (
        <Sun className="h-8 w-8 mr-2" />
      )}
     
    </Button>
  );
};

export default ThemeSwitcher;