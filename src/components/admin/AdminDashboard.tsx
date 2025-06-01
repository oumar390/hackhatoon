
import { WelcomeWidget } from "./WelcomeWidget";
import { DashboardStats } from "./DashboardStats";
import { UserManagement } from "./UserManagement";
import { GroupManagement } from "./GroupManagement";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <WelcomeWidget />
      <DashboardStats />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <UserManagement />
        <GroupManagement />
      </div>
    </div>
  );
}
