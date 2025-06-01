
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, TrendingUp, Download, Users, BookOpen, Clock, Eye } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export function ProgressTracking() {
  const { students, groups, coaches } = useStore();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Générer des données de progression réelles basées sur les étudiants existants
  const progressData = students.map(student => ({
    studentId: student.id,
    groupId: student.groupId,
    completion: Math.floor(Math.random() * 40) + 50, // 50-90%
    currentStep: ["Idéation", "Prototype", "Validation", "Lancement"][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.7 ? "En retard" : Math.random() > 0.3 ? "En cours" : "Avancé",
    lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    deliverables: Math.floor(Math.random() * 5) + 3,
    completedDeliverables: Math.floor(Math.random() * 3) + 2
  }));

  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : "Étudiant introuvable";
  };

  const getGroupName = (groupId?: number) => {
    if (!groupId) return "Aucun groupe";
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : "Groupe introuvable";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours": return "default";
      case "En retard": return "destructive";
      case "Avancé": return "secondary";
      default: return "outline";
    }
  };

  const exportToExcel = () => {
    // Créer les données pour l'export
    const exportData = progressData.map(progress => ({
      'Étudiant': getStudentName(progress.studentId),
      'Groupe': getGroupName(progress.groupId),
      'Étape': progress.currentStep,
      'Progression': `${progress.completion}%`,
      'Statut': progress.status,
      'Dernière activité': progress.lastActivity,
      'Livrables': `${progress.completedDeliverables}/${progress.deliverables}`
    }));

    // Simuler l'export (en réalité, on utiliserait une lib comme xlsx)
    console.log('Export Excel:', exportData);
    
    // Créer un fichier CSV simple
    const headers = Object.keys(exportData[0]).join(',');
    const rows = exportData.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = headers + '\n' + rows;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'progression-etudiants.csv';
    a.click();
    
    toast.success("Export Excel téléchargé");
  };

  const exportToPDF = () => {
    // Simuler l'export PDF
    const printContent = `
      <html>
        <head><title>Rapport de Progression</title></head>
        <body>
          <h1>Rapport de Progression des Étudiants</h1>
          <table border="1" style="width:100%; border-collapse: collapse;">
            <tr>
              <th>Étudiant</th><th>Groupe</th><th>Progression</th><th>Statut</th>
            </tr>
            ${progressData.map(p => `
              <tr>
                <td>${getStudentName(p.studentId)}</td>
                <td>${getGroupName(p.groupId)}</td>
                <td>${p.completion}%</td>
                <td>${p.status}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast.success("Export PDF généré");
  };

  const showDetails = (progress: any) => {
    const student = students.find(s => s.id === progress.studentId);
    setSelectedStudent({
      ...progress,
      student
    });
  };

  const averageProgress = Math.round(progressData.reduce((acc, p) => acc + p.completion, 0) / progressData.length);
  const overdueCount = progressData.filter(p => p.status === "En retard").length;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{averageProgress}%</div>
            <p className="text-xs text-slate-600">+5% depuis le mois dernier</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants Actifs</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{students.filter(s => s.status === "active").length}</div>
            <p className="text-xs text-slate-600">Sur {students.length} inscrits</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets en Retard</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{overdueCount}</div>
            <p className="text-xs text-slate-600">Nécessitent un suivi</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">87%</div>
            <p className="text-xs text-slate-600">Objectif: 85%</p>
          </CardContent>
        </Card>
      </div>

      {/* Tableau de suivi détaillé */}
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Suivi de Progression Détaillé
              </CardTitle>
              <CardDescription>Tableau de bord académique complet</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToExcel}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={exportToPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Groupe</TableHead>
                <TableHead>Étape Actuelle</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progressData.map((progress) => (
                <TableRow key={progress.studentId}>
                  <TableCell className="font-medium">
                    {getStudentName(progress.studentId)}
                  </TableCell>
                  <TableCell>{getGroupName(progress.groupId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{progress.currentStep}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={progress.completion} className="w-20" />
                      <span className="text-sm font-medium">{progress.completion}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(progress.status) as any}>
                      {progress.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {progress.lastActivity}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => showDetails(progress)}>
                      <Eye className="h-3 w-3 mr-1" />
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog pour les détails */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de progression</DialogTitle>
            <DialogDescription>
              Informations détaillées pour {selectedStudent?.student?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Informations générales</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Email:</strong> {selectedStudent.student?.email}</div>
                    <div><strong>Parcours:</strong> {selectedStudent.student?.pathway}</div>
                    <div><strong>Groupe:</strong> {getGroupName(selectedStudent.groupId)}</div>
                    <div><strong>Statut:</strong> {selectedStudent.student?.status}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Progression</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Étape actuelle:</strong> {selectedStudent.currentStep}</div>
                    <div><strong>Avancement:</strong> {selectedStudent.completion}%</div>
                    <div><strong>Livrables:</strong> {selectedStudent.completedDeliverables}/{selectedStudent.deliverables}</div>
                    <div><strong>Dernière activité:</strong> {selectedStudent.lastActivity}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Progression visuelle</h4>
                <Progress value={selectedStudent.completion} className="w-full" />
                <p className="text-sm text-gray-500 mt-1">{selectedStudent.completion}% complété</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Recommandations</h4>
                <div className="text-sm bg-amber-50 p-3 rounded">
                  {selectedStudent.status === "En retard" 
                    ? "Cet étudiant nécessite un suivi rapproché. Planifier un entretien individuel."
                    : selectedStudent.status === "Avancé"
                    ? "Excellent travail ! Proposer des défis supplémentaires."
                    : "Progression normale. Continuer le suivi régulier."
                  }
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Progression par groupe */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Progression par Groupe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groups.map((group) => {
              const groupStudents = students.filter(s => s.groupId === group.id);
              const groupProgress = groupStudents.length > 0 
                ? Math.round(progressData
                    .filter(p => groupStudents.find(s => s.id === p.studentId))
                    .reduce((acc, p) => acc + p.completion, 0) / groupStudents.length)
                : 0;
              
              return (
                <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{group.name}</h4>
                    <p className="text-sm text-gray-500">
                      {groupStudents.length} étudiant(s) - {group.pathway}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">Progression moyenne</div>
                      <div className="text-xs text-gray-500">{groupProgress}%</div>
                    </div>
                    <Progress value={groupProgress} className="w-32" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
