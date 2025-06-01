
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <DashboardLayout 
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    />
  );
};

export default Dashboard;
