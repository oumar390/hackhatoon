
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/store/useStore";
import { CheckCircle, Clock, Lock, FileText, MessageSquare, Upload, UserPlus } from "lucide-react";
import { toast } from "sonner";

export function StudentPathway() {
  const { user } = useAuth();
  const { students } = useStore();
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [coachingRequest, setCoachingRequest] = useState("");
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  
  const currentStudent = students.find(s => s.email === user?.email);
  
  // Données simulées du parcours
  const pathwaySteps = [
    {
      id: 1,
      title: "Idéation et Concept",
      description: "Définir votre idée de projet et valider le concept initial",
      status: "completed",
      progress: 100,
      deliverables: [
        { name: "Fiche concept", status: "submitted", feedback: "Très bonne idée, continuez !" }
      ],
      resources: ["Guide d'idéation", "Templates de validation"],
      dueDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Étude de Marché",
      description: "Analyser votre marché cible et la concurrence",
      status: "completed", 
      progress: 100,
      deliverables: [
        { name: "Analyse de marché", status: "submitted", feedback: "Analyse complète et pertinente" }
      ],
      resources: ["Méthodologie d'étude de marché", "Outils d'analyse"],
      dueDate: "2024-02-01"
    },
    {
      id: 3,
      title: "Business Model Canvas",
      description: "Construire votre modèle économique",
      status: "current",
      progress: 60,
      deliverables: [
        { name: "Business Model Canvas", status: "in-progress", feedback: null }
      ],
      resources: ["Template BMC", "Exemples de BMC", "Vidéo explicative"],
      dueDate: "2024-02-15"
    },
    {
      id: 4,
      title: "Prototype/MVP",
      description: "Développer un prototype de votre solution",
      status: "locked",
      progress: 0,
      deliverables: [
        { name: "Prototype fonctionnel", status: "pending", feedback: null }
      ],
      resources: ["Outils de prototypage", "Guide MVP"],
      dueDate: "2024-03-01"
    },
    {
      id: 5,
      title: "Test Utilisateurs",
      description: "Tester votre prototype auprès d'utilisateurs",
      status: "locked",
      progress: 0,
      deliverables: [
        { name: "Rapport de tests", status: "pending", feedback: null }
      ],
      resources: ["Protocole de test", "Analyse des retours"],
      dueDate: "2024-03-15"
    }
  ];

  const handleCoachingRequest = (stepId: number) => {
    const step = pathwaySteps.find(s => s.id === stepId);
    if (!step) return;
    
    if (!coachingRequest.trim()) {
      toast.error("Veuillez décrire votre demande d'aide");
      return;
    }

    // Simulation d'envoi de demande
    toast.success(`Demande de coaching envoyée pour l'étape "${step.title}". L'administrateur sera notifié.`);
    setCoachingRequest("");
    setIsRequestOpen(false);
  };

  const handleFileUpload = (stepId: number) => {
    toast.success("Fonctionnalité de dépôt de fichier - redirection vers les livrables");
  };

  const handleContactCoach = (stepId: number) => {
    const step = pathwaySteps.find(s => s.id === stepId);
    toast.success(`Ouverture de la discussion pour l'étape "${step?.title}"`);
    // Rediriger vers la messagerie avec contexte
  };

  const handleAccessResource = (resource: string) => {
    toast.success(`Téléchargement de la ressource : ${resource}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "current":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Lock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-300";
      case "current":
        return "bg-blue-100 border-blue-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mon Parcours</h1>
        <Badge variant="secondary">
          Parcours: {currentStudent?.pathway === 'pre-incubation' ? 'Pré-incubation' : 'Incubation'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des étapes */}
        <div className="lg:col-span-2 space-y-4">
          {pathwaySteps.map((step, index) => (
            <Card 
              key={step.id} 
              className={`cursor-pointer transition-all ${getStatusColor(step.status)} ${
                selectedStep === step.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedStep(step.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(step.status)}
                    <div>
                      <CardTitle className="text-lg">Étape {step.id}: {step.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      step.status === "completed" ? "default" : 
                      step.status === "current" ? "secondary" : "outline"
                    }>
                      {step.status === "completed" ? "Terminé" : 
                       step.status === "current" ? "En cours" : "Verrouillé"}
                    </Badge>
                    {step.status !== "locked" && (
                      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <UserPlus className="h-4 w-4 mr-1" />
                            Demander Coach
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Demande de Coaching - {step.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Décrivez votre demande d'aide pour cette étape..."
                              value={coachingRequest}
                              onChange={(e) => setCoachingRequest(e.target.value)}
                              rows={4}
                            />
                            <Button 
                              onClick={() => handleCoachingRequest(step.id)} 
                              className="w-full"
                            >
                              Envoyer la Demande
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{step.progress}%</span>
                  </div>
                  <Progress value={step.progress} />
                  <p className="text-xs text-muted-foreground">
                    Échéance: {new Date(step.dueDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Détails de l'étape sélectionnée */}
        <div className="space-y-4">
          {selectedStep ? (
            (() => {
              const step = pathwaySteps.find(s => s.id === selectedStep);
              if (!step) return null;
              
              return (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Livrables</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {step.deliverables.map((deliverable, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{deliverable.name}</h4>
                            <Badge variant={
                              deliverable.status === "submitted" ? "default" :
                              deliverable.status === "in-progress" ? "secondary" : "outline"
                            }>
                              {deliverable.status === "submitted" ? "Soumis" :
                               deliverable.status === "in-progress" ? "En cours" : "À faire"}
                            </Badge>
                          </div>
                          {deliverable.feedback && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                              <strong>Feedback:</strong> {deliverable.feedback}
                            </div>
                          )}
                          {step.status !== "locked" && (
                            <Button 
                              size="sm" 
                              className="mt-2 w-full"
                              onClick={() => handleFileUpload(step.id)}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {deliverable.status === "submitted" ? "Modifier" : "Déposer"}
                            </Button>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5" />
                        <span>Discussion</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full" 
                        disabled={step.status === "locked"}
                        onClick={() => handleContactCoach(step.id)}
                      >
                        Contacter le Coach
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Posez vos questions sur cette étape
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ressources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {step.resources.map((resource, index) => (
                          <Button 
                            key={index} 
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start"
                            disabled={step.status === "locked"}
                            onClick={() => handleAccessResource(resource)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {resource}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              );
            })()
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Sélectionnez une étape pour voir les détails
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
