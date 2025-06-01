
import { Users, GraduationCap, BookOpen, BarChart3, Library, Settings, Home, Target, MessageCircle, Calendar, FileText, Upload, ClipboardList } from "lucide-react";
import { SessionTimer } from "./SessionTimer";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userRole: string;
}

export function AppSidebar({ activeSection, setActiveSection, userRole }: AppSidebarProps) {
  const adminMenuItems = [
    { title: "Dashboard", icon: Home, id: "dashboard" },
    { title: "Étudiants", icon: Users, id: "students" },
    { title: "Coachs", icon: GraduationCap, id: "coaches" },
    { title: "Parcours", icon: Target, id: "courses" },
    { title: "Suivi Progression", icon: BarChart3, id: "progress" },
    { title: "Demandes de Coaching", icon: ClipboardList, id: "coaching-requests" },
    { title: "Deadlines", icon: Calendar, id: "deadlines" },
    { title: "Bibliothèque", icon: Library, id: "resources" },
    { title: "Paramètres", icon: Settings, id: "settings" },
  ];

  const coachMenuItems = [
    { title: "Dashboard", icon: Home, id: "dashboard" },
    { title: "Progression", icon: BarChart3, id: "progress" },
    { title: "Feedback", icon: BookOpen, id: "feedback" },
    { title: "Messages", icon: MessageCircle, id: "messages" },
    { title: "Ressources", icon: Library, id: "resources" },
  ];

  const studentMenuItems = [
    { title: "Tableau de Bord", icon: Home, id: "dashboard" },
    { title: "Mon Parcours", icon: Target, id: "pathway" },
    { title: "Progression", icon: BarChart3, id: "progress" },
    { title: "Livrables", icon: FileText, id: "deliverables" },
    { title: "Messages", icon: MessageCircle, id: "messages" },
    { title: "Ressources", icon: Library, id: "resources" },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case "admin":
        return adminMenuItems;
      case "coach":
        return coachMenuItems;
      case "student":
        return studentMenuItems;
      default:
        return adminMenuItems;
    }
  };

  return (
    <Sidebar className="border-r border-amber-200" collapsible="icon">
      <SidebarHeader className="border-b border-amber-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="logo/KSP Logo PNG.png" alt="KSP Logo" className="w-full h-full object-contain" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="text-lg font-bold text-amber-800">KNOWLEDGE SHARE</h2>
              <p className="text-xs text-amber-600">PLATFORM</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-amber-50">
        <SidebarGroup>
          <SidebarGroupLabel className="text-amber-800 font-semibold group-data-[collapsible=icon]:hidden">
            {userRole === "admin" ? "Administration" : userRole === "coach" ? "Coaching" : "Étudiant"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full ${
                      activeSection === item.id 
                        ? "bg-amber-100 text-amber-800 border-l-4 border-amber-600" 
                        : "text-amber-700 hover:bg-amber-100/60"
                    }`}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Timer de session avec style amélioré */}
      <div className="mt-auto">
        <SessionTimer className="border-t border-amber-200 text-sm font-medium text-amber-700" />
      </div>
    </Sidebar>
  );
}
