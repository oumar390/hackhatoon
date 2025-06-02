
import { Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Notifications } from "@/components/Notifications";

interface DashboardHeaderProps {
  userRole: string;
}

export function DashboardHeader({ userRole }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleLabel = () => {
    switch (userRole) {
      case "admin":
        return "Administrateur";
      case "coach":
        return "Coach";
      case "student":
        return "Étudiant";
      default:
        return "Utilisateur";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-blue-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {getRoleLabel()}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 h-4 w-4" />
            <Input 
              placeholder="Rechercher..." 
              className="pl-10 w-80 border-blue-200 focus:border-blue-500"
            />
          </div>
          
          <Notifications userId={user?.id || 0} className="text-slate-700" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-slate-700">
                <User className="h-5 w-5" />
                <span>{user?.name || "Utilisateur"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-blue-200">
              <DropdownMenuItem className="text-slate-700">
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
