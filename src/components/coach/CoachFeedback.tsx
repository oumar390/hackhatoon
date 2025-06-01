import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { FileText, Clock, CheckCircle, AlertCircle, MessageSquare, Send, Star, DownloadCloud, File } from "lucide-react";

export function CoachFeedback() {
  const { user } = useAuth();
  const { students, coaches, groups } = useStore();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [grade, setGrade] = useState("");
  
  // Coach actuel
  const currentCoach = coaches.find(c => c.email === user?.email);
  
  // Données simulées pour les travaux à corriger
  const pendingAssignments = [
    { id: 1, title: "Business Model Canvas", student: "Marie Laurent", submitted: "2025-05-27T14:30:00", type: "document", course: "Entrepreneuriat", studentId: 101 },
    { id: 2, title: "Analyse Concurrentielle", student: "Thomas Dubois", submitted: "2025-05-28T09:15:00", type: "document", course: "Stratégie", studentId: 102 },
    { id: 3, title: "Plan Marketing", student: "Sophie Moreau", submitted: "2025-05-29T16:45:00", type: "presentation", course: "Marketing", studentId: 103 },
    { id: 4, title: "Prévisions Financières", student: "Lucas Petit", submitted: "2025-05-30T11:20:00", type: "spreadsheet", course: "Finance", studentId: 104 },
    { id: 5, title: "Pitch Deck", student: "Emma Richard", submitted: "2025-05-31T10:05:00", type: "presentation", course: "Communication", studentId: 105 },
  ];
  
  const completedAssignments = [
    { id: 6, title: "Analyse SWOT", student: "Julien Martin", submitted: "2025-05-20T14:30:00", graded: "2025-05-22T16:20:00", grade: 16, type: "document", course: "Stratégie", studentId: 106 },
    { id: 7, title: "Étude de Marché", student: "Clara Leroy", submitted: "2025-05-21T09:15:00", graded: "2025-05-23T11:45:00", grade: 14, type: "document", course: "Marketing", studentId: 107 },
    { id: 8, title: "Budget Prévisionnel", student: "Antoine Bernard", submitted: "2025-05-22T16:45:00", graded: "2025-05-24T14:30:00", grade: 18, type: "spreadsheet", course: "Finance", studentId: 108 },
    { id: 9, title: "Présentation MVP", student: "Léa Dupont", submitted: "2025-05-23T11:20:00", graded: "2025-05-25T09:15:00", grade: 15, type: "presentation", course: "Produit", studentId: 109 },
    { id: 10, title: "Business Plan", student: "Hugo Rousseau", submitted: "2025-05-24T10:05:00", graded: "2025-05-26T16:45:00", grade: 17, type: "document", course: "Entrepreneuriat", studentId: 110 },
  ];
  
  // Filtrer les travaux par les étudiants gérés par ce coach
  const coachGroups = groups.filter(g => g.coachId === currentCoach?.id);
  const coachStudentIds = coachGroups.flatMap(g => g.studentIds);
  
  // Note: Pour l'étape de développement, nous affichons tous les travaux en attente
  // car les IDs dans les données simulées ne correspondent pas forcément aux vrais IDs
  // En production, on utiliserait: pendingAssignments.filter(a => coachStudentIds.includes(a.studentId))
  const filteredPendingAssignments = pendingAssignments;
  // Même approche pour les travaux complétés en phase de développement
  const filteredCompletedAssignments = completedAssignments;
  
  // Format de date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Si c'est aujourd'hui
    if (date.toDateString() === now.toDateString()) {
      return `Aujourd'hui, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Si c'est hier
    if (date.toDateString() === yesterday.toDateString()) {
      return `Hier, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Sinon afficher la date complète
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getTimeAgo = (dateString: string) => {
    const submittedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - submittedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    }
  };
  
  const getUrgencyBadge = (dateString: string) => {
    const submittedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - submittedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 3) {
      return <Badge variant="outline" className="bg-red-50 text-red-700">Urgent</Badge>;
    } else if (diffDays >= 1) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700">À traiter</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700">Récent</Badge>;
    }
  };
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4 text-amber-700" />;
      case "presentation":
        return <File className="h-4 w-4 text-purple-600" />;
      case "spreadsheet":
        return <FileText className="h-4 w-4 text-green-600" />;
      default:
        return <File className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const getGradeBadge = (grade: number) => {
    if (grade >= 16) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{grade}/20</Badge>;
    } else if (grade >= 12) {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{grade}/20</Badge>;
    } else if (grade >= 8) {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{grade}/20</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{grade}/20</Badge>;
    }
  };
  
  const submitFeedback = () => {
    if (!feedbackText || !grade) {
      toast.error("Veuillez fournir un feedback et une note");
      return;
    }
    
    toast.success("Feedback envoyé avec succès");
    setFeedbackText("");
    setGrade("");
    setSelectedAssignment(null);
    // Dans un cas réel, on enverrait les données à une API
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Corrections & Feedbacks</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-amber-50">
            {filteredPendingAssignments.length} en attente
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            {filteredCompletedAssignments.length} corrigés
          </Badge>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">À corriger</TabsTrigger>
          <TabsTrigger value="completed">Corrigés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Travaux en attente de correction</CardTitle>
              <CardDescription>
                Les travaux rendus par vos étudiants qui nécessitent un feedback et une note
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPendingAssignments.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Tout est à jour !</h3>
                  <p className="text-muted-foreground">
                    Aucun travail en attente de correction pour le moment.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Travail</TableHead>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Cours</TableHead>
                      <TableHead>Soumis le</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendingAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getFileIcon(assignment.type)}
                            <span className="font-medium">{assignment.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{assignment.student}</TableCell>
                        <TableCell>{assignment.course}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatDate(assignment.submitted)}</span>
                            <span className="text-xs text-muted-foreground">
                              {getTimeAgo(assignment.submitted)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getUrgencyBadge(assignment.submitted)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <DownloadCloud className="h-4 w-4 mr-1" />
                              Télécharger
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm"  
                                  onClick={() => setSelectedAssignment(assignment.id)}
                                >
                                  Corriger
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Correction: {assignment.title}</DialogTitle>
                                  <DialogDescription>
                                    Travail soumis par {assignment.student} le {formatDate(assignment.submitted)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="note">Note</Label>
                                    <RadioGroup value={grade} onValueChange={setGrade} className="flex space-x-2">
                                      {[8, 10, 12, 14, 16, 18, 20].map((value) => (
                                        <div key={value} className="flex items-center space-x-1">
                                          <RadioGroupItem value={value.toString()} id={`note-${value}`} />
                                          <Label htmlFor={`note-${value}`}>{value}</Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="feedback">Commentaires</Label>
                                    <Textarea
                                      id="feedback"
                                      placeholder="Entrez votre feedback détaillé ici..."
                                      value={feedbackText}
                                      onChange={(e) => setFeedbackText(e.target.value)}
                                      rows={8}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" type="button">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Contacter l'étudiant
                                  </Button>
                                  <Button type="button" onClick={submitFeedback}>
                                    <Send className="h-4 w-4 mr-1" />
                                    Envoyer
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Travaux corrigés</CardTitle>
              <CardDescription>
                Historique des travaux déjà évalués et notés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCompletedAssignments.length === 0 ? (
                <div className="text-center py-10">
                  <Clock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Aucun historique</h3>
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore corrigé de travaux.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Travail</TableHead>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Cours</TableHead>
                      <TableHead>Corrigé le</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompletedAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getFileIcon(assignment.type)}
                            <span>{assignment.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{assignment.student}</TableCell>
                        <TableCell>{assignment.course}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatDate(assignment.graded)}</span>
                            <span className="text-xs text-muted-foreground">
                              Soumis le {formatDate(assignment.submitted)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getGradeBadge(assignment.grade)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Voir détails
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Statistiques de correction</CardTitle>
          <CardDescription>
            Aperçu de vos activités de correction et d'évaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Temps moyen de correction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">36 heures</div>
                <p className="text-xs text-muted-foreground">
                  Entre la soumission et la correction
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Note moyenne attribuée</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14.8/20</div>
                <p className="text-xs text-muted-foreground">
                  Sur l'ensemble des évaluations
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taux de satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  92%
                  <div className="ml-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Basé sur les retours des étudiants
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
