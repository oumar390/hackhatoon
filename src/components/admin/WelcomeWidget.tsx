
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export function WelcomeWidget() {
  const { user } = useAuth();

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Bienvenue, {user?.name} 👋
            </h2>
            <p className="text-blue-100 mb-4">
              Vous gérez actuellement la plateforme avec succès
            </p>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="font-semibold">Activité cette semaine :</span>
                <span className="ml-2">12 nouveaux étudiants</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
