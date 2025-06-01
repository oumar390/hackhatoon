
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { StudentsManagement } from "@/components/admin/StudentsManagement";
import { CoachesManagement } from "@/components/admin/CoachesManagement";
import { CoursesManagement } from "@/components/admin/CoursesManagement";
import { ProgressTracking } from "@/components/admin/ProgressTracking";
import { ResourcesLibrary } from "@/components/admin/ResourcesLibrary";
import { Settings } from "@/components/admin/Settings";
import { DeadlineManagement } from "@/components/admin/DeadlineManagement";
import { CoachingRequestManagement } from "@/components/admin/CoachingRequestManagement";
import { StudentDashboard } from "@/components/student/StudentDashboard";
import { StudentPathway } from "@/components/student/StudentPathway";
import { StudentDeliverables } from "@/components/student/StudentDeliverables";
import { StudentMessages } from "@/components/student/StudentMessages";
import { StudentProgress } from "@/components/student/StudentProgress";
import { CoachDashboard } from "@/components/coach/CoachDashboard";
import { CoachMessages } from "@/components/coach/CoachMessages";
import { CoachProgress } from "@/components/coach/CoachProgress";
import { CoachFeedback } from "@/components/coach/CoachFeedback";
import { AIChatbot } from "@/components/AIChatbot";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function DashboardLayout({ activeSection, setActiveSection }: DashboardLayoutProps) {
  const { user } = useAuth();
  const userRole = user?.role || "admin";

  const renderContent = () => {
    // Contenu spécifique aux étudiants
    if (userRole === "student") {
      switch (activeSection) {
        case "dashboard":
          return <StudentDashboard />;
        case "pathway":
          return <StudentPathway />;
        case "deliverables":
          return <StudentDeliverables />;
        case "messages":
          return <StudentMessages />;
        case "resources":
          return <ResourcesLibrary />;
        case "progress":
          return <StudentProgress />;
        default:
          return <StudentDashboard />;
      }
    }

    // Contenu spécifique aux coaches
    if (userRole === "coach") {
      // Composant de remplacement temporaire pour le débogage
      const DebugComponent = ({ title }: { title: string }) => (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="p-4 border rounded bg-muted">
            <p>Composant simplifié pour isoler les problèmes.</p>
          </div>
        </div>
      );
      
      switch (activeSection) {
        case "dashboard":
          return <CoachDashboard />;
        case "progress":
          return <CoachProgress />;
        case "feedback":
          return <CoachFeedback />;
        case "messages":
          return <CoachMessages />;
        case "resources":
          return <ResourcesLibrary />;
        default:
          return <CoachDashboard />;
      }
    }

    // Contenu pour les administrateurs
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "students":
        return <StudentsManagement />;
      case "coaches":
        return <CoachesManagement />;
      case "courses":
        return <CoursesManagement />;
      case "progress":
        return <ProgressTracking />;
      case "resources":
        return <ResourcesLibrary />;
      case "deadlines":
        return <DeadlineManagement />;
      case "coaching-requests":
        return <CoachingRequestManagement />;
      case "settings":
        return <Settings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          userRole={userRole}
        />
        <div className="flex-1">
          <div className="h-16 border-b bg-white flex items-center px-4">
            <SidebarTrigger className="mr-4" />
            <DashboardHeader userRole={userRole} />
          </div>
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
        <AIChatbot />
      </div>
    </SidebarProvider>
  );
}
