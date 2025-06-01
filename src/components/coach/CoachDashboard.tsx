import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/contexts/AuthContext";
import { PieChart, LineChart, BarChart, Cell, ResponsiveContainer, Pie, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { CalendarDays, MessageSquare, CheckSquare, Clock, Users, BookOpen, User } from "lucide-react";

export function CoachDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { students, coaches, groups, courses, deadlines, coachingRequests } = useStore();
  
  // Fonctions de navigation
  const goToFeedback = () => navigate("/dashboard/feedback");
  const goToMessages = () => navigate("/dashboard/messages");
  const goToCalendar = () => navigate("/dashboard/calendar"); // Sera redirigé vers la section par défaut si calendar n'existe pas
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalGroups: 0,
    pendingReviews: 0,
    completedReviews: 0,
    unreadMessages: 0,
  });

  // Simuler des données pour les graphiques
  const activityData = [
    { date: "Lundi", étudiants: 10, messages: 24, corrections: 5 },
    { date: "Mardi", étudiants: 12, messages: 18, corrections: 7 },
    { date: "Mercredi", étudiants: 8, messages: 30, corrections: 3 },
    { date: "Jeudi", étudiants: 15, messages: 27, corrections: 8 },
    { date: "Vendredi", étudiants: 14, messages: 36, corrections: 6 },
    { date: "Samedi", étudiants: 5, messages: 12, corrections: 2 },
    { date: "Dimanche", étudiants: 3, messages: 8, corrections: 1 },
  ];

  const progressByModuleData = [
    { module: "Business Model Canvas", complet: 65, en_cours: 25, non_commencé: 10 },
    { module: "Étude de Marché", complet: 40, en_cours: 45, non_commencé: 15 },
    { module: "Stratégie Marketing", complet: 25, en_cours: 35, non_commencé: 40 },
    { module: "Gestion Financière", complet: 15, en_cours: 30, non_commencé: 55 },
  ];

  const satisfactionData = [
    { niveau: "Très satisfait", pourcentage: 45 },
    { niveau: "Satisfait", pourcentage: 30 },
    { niveau: "Neutre", pourcentage: 15 },
    { niveau: "Insatisfait", pourcentage: 7 },
    { niveau: "Très insatisfait", pourcentage: 3 },
  ];

  // Filtrer les groupes dont le coach est l'utilisateur actuel
  useEffect(() => {
    if (!user) return;

    // Trouver le coach correspondant à l'utilisateur actuel par email
    const currentCoach = coaches.find(c => c.email === user.email);
    if (!currentCoach) return;

    // Filtrer les groupes gérés par ce coach
    const coachGroups = groups.filter(g => g.coachId === currentCoach.id);
    
    // Obtenir les IDs des étudiants dans ces groupes
    const studentIds = coachGroups.flatMap(g => g.studentIds);
    
    // Obtenir les étudiants correspondants
    const coachStudents = students.filter(s => studentIds.includes(s.id));
    
    // Calculer les statistiques
    const activeStudents = coachStudents.filter(s => s.isActive).length;
    
    // Simuler des données pour les reviews et messages
    const pendingReviews = Math.floor(coachStudents.length * 0.7);
    const completedReviews = Math.floor(coachStudents.length * 2.5);
    const unreadMessages = Math.floor(coachStudents.length * 1.2);
    
    setStats({
      totalStudents: coachStudents.length,
      activeStudents,
      totalGroups: coachGroups.length,
      pendingReviews,
      completedReviews,
      unreadMessages
    });
  }, [user, students, groups]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord Coach</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Mai 2025
        </Button>
      </div>

      {/* Cartes statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Étudiants à gérer
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeStudents} actifs actuellement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Groupes à suivre</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGroups}</div>
            <p className="text-xs text-muted-foreground">
              Répartis sur {courses.length} cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corrections à faire</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedReviews} corrections terminées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages non lus</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              Provenant de {Math.ceil(stats.unreadMessages / 3)} étudiants
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour différentes analyses */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activité Hebdomadaire</TabsTrigger>
          <TabsTrigger value="progress">Progression par Module</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction Étudiants</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité de la semaine</CardTitle>
              <CardDescription>
                Nombre d'étudiants actifs, messages reçus et corrections effectuées
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="étudiants" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="messages" stroke="#22c55e" />
                  <Line type="monotone" dataKey="corrections" stroke="#f97316" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progression des étudiants par module</CardTitle>
              <CardDescription>
                Répartition des états d'avancement par module
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={progressByModuleData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="module" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="complet" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="en_cours" stackId="a" fill="#22d3ee" />
                  <Bar dataKey="non_commencé" stackId="a" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Satisfaction des étudiants</CardTitle>
              <CardDescription>
                Basé sur les retours et évaluations des derniers modules
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="pourcentage"
                    nameKey="niveau"
                    label={({ niveau, pourcentage }) => `${niveau}: ${pourcentage}%`}
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#10b981", "#3b82f6", "#f59e0b", "#f97316", "#e11d48"][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cartes d'actions rapides */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Corrections Urgentes</CardTitle>
            <CardDescription>
              Rendus en attente depuis plus de 48h
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Julien D. - Business Model Canvas</div>
                  <div className="text-red-500 text-xs">3 jours</div>
                </div>
                <Progress value={100} className="h-1 bg-red-100" indicatorClassName="bg-red-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Sophie M. - Analyse Concurrentielle</div>
                  <div className="text-red-500 text-xs">2 jours</div>
                </div>
                <Progress value={100} className="h-1 bg-red-100" indicatorClassName="bg-red-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Thomas L. - Plan Marketing</div>
                  <div className="text-amber-500 text-xs">1 jour</div>
                </div>
                <Progress value={65} className="h-1" />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={goToFeedback}>
                Voir toutes les corrections en attente
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Messages Récents</CardTitle>
            <CardDescription>
              Derniers messages reçus des étudiants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-2 border-b">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-amber-700" />
                </div>
                <div>
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-medium">Marie C.</p>
                    <p className="text-xs text-muted-foreground">Il y a 35 min</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Bonjour, j'ai une question concernant les prévisions financières...
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-2 border-b">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-amber-700" />
                </div>
                <div>
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-medium">Lucas F.</p>
                    <p className="text-xs text-muted-foreground">Il y a 2h</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Merci pour vos retours sur mon canvas. J'ai effectué les modifications...
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-amber-700" />
                </div>
                <div>
                  <div className="flex justify-between w-full">
                    <p className="text-sm font-medium">Emma R.</p>
                    <p className="text-xs text-muted-foreground">Hier</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    J'ai besoin d'un délai supplémentaire pour rendre mon analyse...
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={goToMessages}>
                Aller à la messagerie
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Prochaines Échéances</CardTitle>
            <CardDescription>
              Dates importantes pour vos groupes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Calculer les deadlines pour les groupes du coach */}
            {(() => {
              // Récupérer les id des groupes du coach actuel
              const coachId = coaches.find(c => c.email === user?.email)?.id;
              const coachGroupIds = groups.filter(g => g.coachId === coachId).map(g => g.id);
              
              // Filtrer les deadlines pour les groupes du coach et les trier par date
              const coachDeadlines = deadlines
                .filter(d => d.groupIds && d.groupIds.some(gId => coachGroupIds.includes(gId)))
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 4); // Limiter à 4 deadlines
              
              if (coachDeadlines.length === 0) {
                return <p className="text-sm text-center text-muted-foreground py-2">Aucune échéance à venir</p>
              }
              
              return (
                <div className="space-y-4">
                  {coachDeadlines.map(deadline => {
                    // Calculer les jours restants
                    const dueDate = new Date(deadline.dueDate);
                    const today = new Date();
                    const diffTime = dueDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    // Déterminer la couleur et le texte en fonction des jours restants
                    let timeColor = "text-amber-600";
                    let timeText = `Dans ${diffDays} jours`;
                    
                    if (diffDays <= 0) {
                      timeColor = "text-red-500";
                      timeText = diffDays === 0 ? "Aujourd'hui" : `En retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
                    } else if (diffDays === 1) {
                      timeColor = "text-red-500";
                      timeText = "Demain";
                    } else if (diffDays <= 3) {
                      timeColor = "text-amber-500";
                    } else if (diffDays <= 7) {
                      timeColor = "text-emerald-500";
                      timeText = "Dans 1 semaine";
                    } else if (diffDays <= 14) {
                      timeColor = "text-amber-600";
                      timeText = "Dans 2 semaines";
                    }
                    
                    // Trouver les groupes concernés par cette échéance
                    const concernedGroups = groups.filter(g => deadline.groupIds && deadline.groupIds.includes(g.id));
                    const totalStudents = concernedGroups.reduce((sum, group) => sum + group.studentIds.length, 0);
                    
                    // Obtenir tous les groupes du coach
                    const coachAssignedGroups = groups.filter(g => {
                      // Trouver les demandes de coaching approuvées pour ce coach
                      const requests = coachingRequests.filter(r => r.coachId === user?.id && r.status === "approved");
                      // Vérifier si ce groupe est assigné à ce coach
                      return requests.some(r => r.groupId === g.id);
                    });
                    
                    const groupsText = concernedGroups.length === coachAssignedGroups.length ? "Tous les groupes" : concernedGroups.map(g => g.name).join(', ');
                    
                    return (
                      <div className="space-y-1" key={deadline.id}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{deadline.title}</p>
                          <p className={`text-xs font-medium ${timeColor}`}>{timeText}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {groupsText} • {totalStudents} étudiant{totalStudents > 1 ? 's' : ''} concerné{totalStudents > 1 ? 's' : ''}
                        </p>
                      </div>
                    );
                  })}
                  
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={goToCalendar}>
                    Voir le calendrier complet
                  </Button>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
