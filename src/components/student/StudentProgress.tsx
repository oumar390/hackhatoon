import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Target, Clock, CheckCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/contexts/AuthContext";

export function StudentProgress() {
  const { user } = useAuth();
  const { students, groups, coaches } = useStore();
  
  // Récupérer uniquement les données de l'étudiant connecté
  const currentStudent = students.find(s => s.email === user?.email);
  const studentGroup = groups.find(g => g.studentIds.includes(currentStudent?.id || 0));
  const groupStudents = studentGroup 
    ? students.filter(s => studentGroup.studentIds.includes(s.id))
    : [];
  const assignedCoach = coaches.find(c => c.id === studentGroup?.coachId);
  
  // Données de progression spécifiques à l'étudiant uniquement
  const studentProgress = {
    currentStep: 3,
    totalSteps: 8,
    completedDeliverables: 5,
    totalDeliverables: 12,
    overallProgress: 42
  };

  // Données de progression spécifiques au groupe de l'étudiant
  const groupProgresses = groupStudents.map(student => ({
    studentId: student.id,
    studentName: student.name,
    completion: Math.floor(Math.random() * 30) + 30, // Entre 30% et 60%
    currentStep: ["Idéation", "Prototype", "Validation"][Math.floor(Math.random() * 3)],
  }));

  // Progression moyenne du groupe
  const groupAverageProgress = groupProgresses.length > 0
    ? Math.round(groupProgresses.reduce((acc, p) => acc + p.completion, 0) / groupProgresses.length)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ma Progression</h1>
      
      {/* Statistiques personnelles uniquement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ma Progression</CardTitle>
            <Target className="h-4 w-4 text-amber-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentProgress.overallProgress}%</div>
            <Progress value={studentProgress.overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Étape {studentProgress.currentStep}/{studentProgress.totalSteps}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mon Étape Actuelle</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
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
            <div className="text-2xl font-bold">{studentProgress.completedDeliverables}/{studentProgress.totalDeliverables}</div>
            <p className="text-xs text-muted-foreground">Complétés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression du Groupe</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupAverageProgress}%</div>
            <Progress value={groupAverageProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{groupStudents.length} membres</p>
          </CardContent>
        </Card>
      </div>

      {/* Progression du groupe de l'étudiant uniquement */}
      {studentGroup && (
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progression de mon groupe: {studentGroup.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progression moyenne du groupe */}
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Progression moyenne</h3>
                  <p className="text-sm text-muted-foreground">
                    {groupStudents.length} membres - Coach: {assignedCoach?.name || "Non assigné"}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{groupAverageProgress}%</div>
                  </div>
                  <Progress value={groupAverageProgress} className="w-32" />
                </div>
              </div>
              
              {/* Progression individuelle des membres du groupe */}
              {groupStudents.map((student) => {
                const progress = groupProgresses.find(p => p.studentId === student.id);
                if (!progress) return null;
                
                // Ne pas afficher les détails des autres étudiants, seulement leur nom et progression
                return (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {student.id === currentStudent?.id ? "(Vous)" : ""}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{progress.completion}%</div>
                      </div>
                      <Progress value={progress.completion} className="w-32" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
