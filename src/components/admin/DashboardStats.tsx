
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, BookOpen, Clock, FileCheck, TrendingUp, Calendar } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState } from "react";

export function DashboardStats() {
  const { students, groups, coaches } = useStore();
  const [progressFilter, setProgressFilter] = useState("all");

  // Calcul des statistiques
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  const totalGroups = groups.length;
  const documentSubmissionRate = 68; // Simulation du taux de dépôt de documents
  const averageProgress = 75;
  const overdueDeadlines = 3;

  // Filtrage par taux d'avancement
  const getFilteredData = () => {
    switch (progressFilter) {
      case "high": // > 80%
        return {
          students: students.filter(() => Math.random() > 0.7), // Simulation
          groups: groups.filter(() => Math.random() > 0.6)
        };
      case "medium": // 50-80%
        return {
          students: students.filter(() => Math.random() > 0.5),
          groups: groups.filter(() => Math.random() > 0.4)
        };
      case "low": // < 50%
        return {
          students: students.filter(() => Math.random() > 0.8),
          groups: groups.filter(() => Math.random() > 0.7)
        };
      default:
        return { students, groups };
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filtrer par avancement:</span>
          <Select value={progressFilter} onValueChange={setProgressFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les utilisateurs</SelectItem>
              <SelectItem value="high">Avancement élevé (&gt;80%)</SelectItem>
              <SelectItem value="medium">Avancement moyen (50-80%)</SelectItem>
              <SelectItem value="low">Avancement faible (&lt;50%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm">
          Exporter les données
        </Button>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants Actifs</CardTitle>
            <Users className="h-4 w-4 text-amber-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{activeStudents}</div>
            <p className="text-xs text-slate-600">
              Sur {totalStudents} inscrits ({filteredData.students.length} filtrés)
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Dépôt</CardTitle>
            <FileCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{documentSubmissionRate}%</div>
            <p className="text-xs text-slate-600">Documents remis à temps</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deadlines en Retard</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{overdueDeadlines}</div>
            <p className="text-xs text-slate-600">Nécessitent un suivi</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{averageProgress}%</div>
            <p className="text-xs text-slate-600">Objectif: 85%</p>
          </CardContent>
        </Card>
      </div>

      {/* Données filtrées */}
      {progressFilter !== "all" && (
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Résultats Filtrés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Étudiants ({filteredData.students.length})</h4>
                <div className="space-y-1">
                  {filteredData.students.slice(0, 5).map(student => (
                    <div key={student.id} className="text-sm p-2 bg-gray-50 rounded">
                      {student.name}
                    </div>
                  ))}
                  {filteredData.students.length > 5 && (
                    <div className="text-sm text-gray-500">
                      +{filteredData.students.length - 5} autres...
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Groupes ({filteredData.groups.length})</h4>
                <div className="space-y-1">
                  {filteredData.groups.slice(0, 5).map(group => (
                    <div key={group.id} className="text-sm p-2 bg-gray-50 rounded">
                      {group.name}
                    </div>
                  ))}
                  {filteredData.groups.length > 5 && (
                    <div className="text-sm text-gray-500">
                      +{filteredData.groups.length - 5} autres...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
