import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/store/useStore";
import { LineChart, BarChart, ResponsiveContainer, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, AlertCircle, BarChart3, User, Users } from "lucide-react";

export function CoachProgress() {
  const { user } = useAuth();
  const { students, groups, coaches, courses, deadlines } = useStore();
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  
  // Récupérer le coach actuel
  const currentCoach = coaches.find(c => c.email === user?.email);
  
  // Récupérer les groupes gérés par ce coach
  const coachGroups = groups.filter(g => g.coachId === currentCoach?.id);
  
  // Récupérer les IDs des étudiants dans ces groupes
  const coachStudentIds = coachGroups.flatMap(g => g.studentIds);
  
  // Récupérer les étudiants correspondants
  const coachStudents = students.filter(s => coachStudentIds.includes(s.id));
  
  // Si aucun groupe n'est sélectionné, sélectionnez le premier par défaut
  useEffect(() => {
    if (coachGroups.length > 0 && !selectedGroup) {
      setSelectedGroup(coachGroups[0].id.toString());
    }
  }, [coachGroups, selectedGroup]);
  
  // Si aucun cours n'est sélectionné, sélectionnez le premier par défaut
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].id.toString());
    }
  }, [courses, selectedCourse]);
  
  // Filtrer les étudiants par groupe sélectionné
  const filteredStudents = selectedGroup 
    ? students.filter(s => {
        const group = groups.find(g => g.id.toString() === selectedGroup);
        return group && group.studentIds.includes(s.id);
      })
    : coachStudents;
    
  // Filtrer les échéances par groupe sélectionné
  const filteredDeadlines = deadlines.filter(d => {
    // Si un groupe est sélectionné, ne montrer que les échéances pour ce groupe
    if (selectedGroup && d.groupIds) {
      const groupId = parseInt(selectedGroup, 10);
      return d.groupIds.includes(groupId);
    }
    // Sinon montrer toutes les échéances pour tous les groupes de ce coach
    return d.groupIds && d.groupIds.some(gId => coachGroups.some(cg => cg.id === gId));
  });
  
  // Trier les échéances par date
  const sortedDeadlines = [...filteredDeadlines].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  
  // Trier les étudiants par progression
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    return (b.progress || 0) - (a.progress || 0);
  });
  
  // Calculer les statistiques de progression
  const averageProgress = sortedStudents.length > 0
    ? sortedStudents.reduce((sum, student) => sum + (student.progress || 0), 0) / sortedStudents.length
    : 0;
  
  const studentsAtRisk = sortedStudents.filter(s => (s.progress || 0) < 40).length;
  const studentsOnTrack = sortedStudents.filter(s => (s.progress || 0) >= 40 && (s.progress || 0) < 75).length;
  const studentsExcelling = sortedStudents.filter(s => (s.progress || 0) >= 75).length;
  
  // Données pour les graphiques
  const progressByWeekData = [
    { semaine: "Semaine 1", moyenne: 20, meilleur: 35, pire: 10 },
    { semaine: "Semaine 2", moyenne: 32, meilleur: 48, pire: 18 },
    { semaine: "Semaine 3", moyenne: 43, meilleur: 62, pire: 25 },
    { semaine: "Semaine 4", moyenne: 51, meilleur: 75, pire: 30 },
    { semaine: "Semaine 5", moyenne: 58, meilleur: 85, pire: 35 },
    { semaine: "Semaine 6", moyenne: 64, meilleur: 92, pire: 42 },
    { semaine: "Semaine 7", moyenne: 69, meilleur: 95, pire: 48 },
    { semaine: "Semaine 8", moyenne: 75, meilleur: 98, pire: 55 },
  ];
  
  const moduleCompletionData = [
    { module: "Business Model Canvas", complété: 85, en_cours: 10, non_commencé: 5 },
    { module: "Étude de Marché", complété: 65, en_cours: 25, non_commencé: 10 },
    { module: "Plan Marketing", complété: 45, en_cours: 35, non_commencé: 20 },
    { module: "Finance", complété: 30, en_cours: 40, non_commencé: 30 },
    { module: "Présentation", complété: 20, en_cours: 35, non_commencé: 45 },
  ];
  
  // Obtenir le groupe sélectionné
  const selectedGroupData = groups.find(g => g.id.toString() === selectedGroup);
  
  // Obtenir le cours sélectionné
  const selectedCourseData = courses.find(c => c.id.toString() === selectedCourse);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Suivi des Progrès</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4 col-span-1">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sélectionner un Groupe</h3>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un groupe" />
              </SelectTrigger>
              <SelectContent>
                {coachGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sélectionner un Cours</h3>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un cours" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Période d'Analyse</h3>
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Semaine</TabsTrigger>
                <TabsTrigger value="month">Mois</TabsTrigger>
                <TabsTrigger value="all">Global</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Informations du Groupe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedGroupData ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nom:</span>
                    <span className="text-sm font-medium">{selectedGroupData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Étudiants:</span>
                    <span className="text-sm font-medium">{selectedGroupData.studentIds.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Progrès moyen:</span>
                    <span className="text-sm font-medium">{averageProgress.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cours:</span>
                    <span className="text-sm font-medium">{selectedCourseData?.title || "Non défini"}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun groupe sélectionné</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Répartition des Progrès</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">En difficulté</span>
                  </div>
                  <span className="text-sm font-medium">{studentsAtRisk}</span>
                </div>
                <Progress value={(studentsAtRisk / sortedStudents.length) * 100} className="h-2 bg-red-100" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">En progression</span>
                  </div>
                  <span className="text-sm font-medium">{studentsOnTrack}</span>
                </div>
                <Progress value={(studentsOnTrack / sortedStudents.length) * 100} className="h-2 bg-amber-100" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Excellence</span>
                  </div>
                  <span className="text-sm font-medium">{studentsExcelling}</span>
                </div>
                <Progress value={(studentsExcelling / sortedStudents.length) * 100} className="h-2 bg-green-100" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="students">Étudiants</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Progression moyenne</CardTitle>
                    <CardDescription>
                      {selectedPeriod === "week" ? "Cette semaine" : selectedPeriod === "month" ? "Ce mois" : "Global"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{averageProgress.toFixed(1)}%</div>
                    <div className="flex items-center text-xs text-green-500 mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>+4.3% depuis la période précédente</span>
                    </div>
                    <Progress value={averageProgress} className="h-2 mt-3" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
                    <CardDescription>
                      Travaux rendus à temps
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78.3%</div>
                    <div className="flex items-center text-xs text-red-500 mt-1">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      <span>-2.1% depuis la période précédente</span>
                    </div>
                    <Progress value={78.3} className="h-2 mt-3" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Interaction</CardTitle>
                    <CardDescription>
                      Activité et engagement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">65.8%</div>
                    <div className="flex items-center text-xs text-green-500 mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>+5.7% depuis la période précédente</span>
                    </div>
                    <Progress value={65.8} className="h-2 mt-3" />
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Évolution de la progression</CardTitle>
                  <CardDescription>
                    Progression moyenne, meilleure et moins bonne performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={progressByWeekData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="semaine" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="moyenne" stroke="#3b82f6" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="meilleur" stroke="#22c55e" />
                      <Line type="monotone" dataKey="pire" stroke="#ef4444" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Progression par module</CardTitle>
                  <CardDescription>
                    État d'avancement des différents modules
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={moduleCompletionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="module" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="complété" stackId="a" fill="#22c55e" />
                      <Bar dataKey="en_cours" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="non_commencé" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Progrès des étudiants</CardTitle>
                  <CardDescription>
                    Progression individuelle des étudiants du groupe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sortedStudents.length === 0 ? (
                    <div className="text-center py-6">
                      <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-muted-foreground">Aucun étudiant dans ce groupe</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Étudiant</TableHead>
                          <TableHead>Progression</TableHead>
                          <TableHead>Dernière activité</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                  <User className="h-4 w-4 text-amber-700" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{student.firstName} {student.lastName}</p>
                                  <p className="text-xs text-muted-foreground">{student.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span>{student.progress || 0}%</span>
                                </div>
                                <Progress 
                                  value={student.progress || 0} 
                                  className={`h-2 ${(student.progress || 0) < 40 ? 'bg-red-100' : (student.progress || 0) < 75 ? 'bg-amber-100' : 'bg-green-100'}`}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{new Date(student.lastActive || Date.now()).toLocaleDateString('fr-FR')}</p>
                              <p className="text-xs text-muted-foreground">{new Date(student.lastActive || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                            </TableCell>
                            <TableCell>
                              {(student.progress || 0) < 40 ? (
                                <Badge variant="outline" className="bg-red-50 text-red-700">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  En difficulté
                                </Badge>
                              ) : (student.progress || 0) < 75 ? (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                  <Clock className="h-3 w-3 mr-1" />
                                  En progression
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Excellent
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">Détails</Button>
                                <Button variant="outline" size="sm">Message</Button>
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
            
            <TabsContent value="modules">
              <Card>
                <CardHeader>
                  <CardTitle>Progression par module</CardTitle>
                  <CardDescription>
                    Taux de complétion et statistiques des modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead>Complétion</TableHead>
                        <TableHead>Note moyenne</TableHead>
                        <TableHead>Temps moyen</TableHead>
                        <TableHead>Difficulté perçue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {moduleCompletionData.map((module, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                <BarChart3 className="h-4 w-4 text-amber-700" />
                              </div>
                              <p className="font-medium text-sm">{module.module}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>{module.complété}%</span>
                              </div>
                              <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                <div 
                                  className="bg-green-500 h-full" 
                                  style={{ width: `${module.complété}%` }}
                                ></div>
                                <div 
                                  className="bg-amber-400 h-full" 
                                  style={{ width: `${module.en_cours}%` }}
                                ></div>
                                <div 
                                  className="bg-red-400 h-full" 
                                  style={{ width: `${module.non_commencé}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Complété</span>
                                <span>En cours</span>
                                <span>Non commencé</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">{15 - index * 0.8}/20</span>
                              {index < 2 ? (
                                <ArrowUpRight className="h-3 w-3 text-green-500" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 text-red-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{2 + index * 0.5} heures</span>
                          </TableCell>
                          <TableCell>
                            {index < 2 ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Facile
                              </Badge>
                            ) : index < 4 ? (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                Moyen
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700">
                                Difficile
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Carte des échéances */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>
                    Échéances à venir
                  </CardTitle>
                  <CardDescription>
                    {selectedGroup
                      ? `Échéances pour ${groups.find(g => g.id.toString() === selectedGroup)?.name}`
                      : 'Échéances pour tous les groupes'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sortedDeadlines.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titre</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Date limite</TableHead>
                          <TableHead>Cours</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedDeadlines.map((deadline) => {
                          // Calculer les jours restants
                          const dueDate = new Date(deadline.dueDate);
                          const today = new Date();
                          const diffTime = dueDate.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          
                          // Trouver le cours correspondant
                          const course = courses.find(c => c.id === deadline.courseId);
                          
                          return (
                            <TableRow key={deadline.id}>
                              <TableCell className="font-medium">{deadline.title}</TableCell>
                              <TableCell>{deadline.description}</TableCell>
                              <TableCell>
                                {new Date(deadline.dueDate).toLocaleDateString('fr-FR')} à {new Date(deadline.dueDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                <div className="text-xs mt-1">
                                  {diffDays > 0 ? (
                                    <span className={`${diffDays <= 3 ? 'text-red-500' : diffDays <= 7 ? 'text-amber-500' : 'text-green-500'}`}>
                                      Dans {diffDays} jour{diffDays > 1 ? 's' : ''}
                                    </span>
                                  ) : diffDays === 0 ? (
                                    <span className="text-red-500 font-bold">Aujourd'hui</span>
                                  ) : (
                                    <span className="text-red-500 font-bold">En retard de {Math.abs(diffDays)} jour{Math.abs(diffDays) > 1 ? 's' : ''}</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{course?.title || 'Non défini'}</TableCell>
                              <TableCell>
                                {diffDays > 7 ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700">À venir</Badge>
                                ) : diffDays > 0 ? (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700">Proche</Badge>
                                ) : diffDays === 0 ? (
                                  <Badge variant="outline" className="bg-red-50 text-red-700">Aujourd'hui</Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-50 text-gray-700">Passé</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">Aucune échéance trouvée pour ce groupe</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
