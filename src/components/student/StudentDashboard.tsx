
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Target, Clock, CheckCircle, MessageSquare } from "lucide-react";

export function StudentDashboard() {
  const { user } = useAuth();
  const { students, groups, coaches } = useStore();
  
  // Trouver l'étudiant actuel et son groupe uniquement
  const currentStudent = students.find(s => s.email === user?.email);
  const studentGroup = groups.find(g => g.studentIds.includes(currentStudent?.id || 0));
  const assignedCoach = coaches.find(c => c.id === studentGroup?.coachId);
  
  // Données de progression spécifiques à l'étudiant uniquement
  const progressData = {
    currentStep: 3,
    totalSteps: 8,
    completedDeliverables: 5,
    totalDeliverables: 12,
    overallProgress: 42
  };

  const recentActivities = [
    { id: 1, type: "deliverable", title: "Livrable : Business Model Canvas", date: "Il y a 2 jours", status: "submitted" },
    { id: 2, type: "feedback", title: "Feedback reçu sur l'étude de marché", date: "Il y a 3 jours", status: "received" },
    { id: 3, type: "discussion", title: "Discussion avec le coach", date: "Il y a 5 jours", status: "completed" },
  ];

  const nextDeadlines = [
    { title: "Business Model Canvas", date: "2024-02-15", urgent: true },
    { title: "Prototype MVP", date: "2024-03-01", urgent: false },
    { title: "Test utilisateurs", date: "2024-03-15", urgent: false }
  ];

  const handleContactCoach = () => {
    if (!assignedCoach) {
      alert("Aucun coach n'est assigné à votre groupe pour le moment.");
      return;
    }
    // Redirection vers la messagerie
    window.location.hash = '#messages';
  };

  return (
    <div className="space-y-6">
      {/* En-tête de bienvenue personnalisé - uniquement données de l'étudiant */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">Bonjour {currentStudent?.name} !</h1>
        <p className="mt-2 opacity-90">
          Votre parcours {currentStudent?.pathway === 'pre-incubation' ? 'de pré-incubation' : 'd\'incubation'} progresse bien
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="text-sm">
            Mon Groupe: <span className="font-semibold">{studentGroup?.name || "Non assigné"}</span>
          </div>
          <div className="text-sm">
            Mon Coach: <span className="font-semibold">{assignedCoach?.name || "Non assigné"}</span>
          </div>
        </div>
      </div>

      {/* Statistiques personnelles uniquement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ma Progression</CardTitle>
            <Target className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.overallProgress}%</div>
            <Progress value={progressData.overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Étape {progressData.currentStep}/{progressData.totalSteps}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mon Étape Actuelle</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Business Model Canvas</div>
            <p className="text-xs text-muted-foreground">En cours de validation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Livrables</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.completedDeliverables}/{progressData.totalDeliverables}</div>
            <p className="text-xs text-muted-foreground">Complétés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mon Coach</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{assignedCoach?.name || "Non assigné"}</div>
            <Button size="sm" className="mt-2 w-full" variant="outline" onClick={handleContactCoach}>
              <MessageSquare className="h-3 w-3 mr-1" />
              Contacter
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Prochaines échéances - uniquement pour cet étudiant */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Prochaines Échéances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nextDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{deadline.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(deadline.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Badge variant={deadline.urgent ? "destructive" : "secondary"}>
                  {deadline.urgent ? "Urgent" : "À venir"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activités récentes - uniquement pour cet étudiant */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Activités Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'deliverable' ? 'bg-blue-600' :
                  activity.type === 'feedback' ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.date}</p>
                </div>
                <Badge variant="outline">
                  {activity.status === 'submitted' ? 'Soumis' : 
                   activity.status === 'received' ? 'Reçu' : 'Terminé'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
