
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileText, Calendar, MessageSquare, Download, Eye } from "lucide-react";
import { toast } from "sonner";

export function StudentDeliverables() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Données simulées des livrables
  const deliverables = [
    {
      id: 1,
      title: "Fiche Concept",
      step: "Idéation",
      dueDate: "2024-01-15",
      status: "submitted",
      submittedDate: "2024-01-14",
      version: 2,
      feedback: "Excellente idée ! La proposition de valeur est claire. Quelques ajustements mineurs à prévoir pour la suite.",
      grade: "A",
      files: [
        { name: "concept_v1.pdf", size: "2.3 MB", uploadDate: "2024-01-12" },
        { name: "concept_v2.pdf", size: "2.8 MB", uploadDate: "2024-01-14" }
      ]
    },
    {
      id: 2,
      title: "Analyse de Marché",
      step: "Étude de Marché", 
      dueDate: "2024-02-01",
      status: "submitted",
      submittedDate: "2024-01-30",
      version: 1,
      feedback: "Analyse très complète. Les données chiffrées apportent de la crédibilité à votre étude.",
      grade: "A-",
      files: [
        { name: "analyse_marche.pdf", size: "4.1 MB", uploadDate: "2024-01-30" },
        { name: "tableaux_donnees.xlsx", size: "856 KB", uploadDate: "2024-01-30" }
      ]
    },
    {
      id: 3,
      title: "Business Model Canvas",
      step: "Business Model",
      dueDate: "2024-02-15",
      status: "in-progress",
      submittedDate: null,
      version: 0,
      feedback: null,
      grade: null,
      files: []
    },
    {
      id: 4,
      title: "Prototype MVP",
      step: "Prototypage",
      dueDate: "2024-03-01",
      status: "pending",
      submittedDate: null,
      version: 0,
      feedback: null,
      grade: null,
      files: []
    }
  ];

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    // Simulation d'upload
    toast.success("Fichier téléchargé avec succès !");
    setSelectedFile(null);
    setDescription("");
    setIsUploadOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-green-100 text-green-800">Soumis</Badge>;
      case "in-progress":
        return <Badge className="bg-orange-100 text-orange-800">En cours</Badge>;
      case "pending":
        return <Badge variant="outline">À faire</Badge>;
      case "late":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getGradeBadge = (grade: string | null) => {
    if (!grade) return null;
    
    const colorClass = grade.startsWith('A') ? 'bg-green-500' : 
                      grade.startsWith('B') ? 'bg-amber-600' : 
                      grade.startsWith('C') ? 'bg-orange-500' : 'bg-red-500';
    
    return <Badge className={`${colorClass} text-white`}>{grade}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes Livrables</h1>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Nouveau Livrable
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Déposer un Livrable</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fichier</label>
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optionnelle)</label>
                <Textarea
                  placeholder="Décrivez votre livrable..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button onClick={handleFileUpload} className="w-full">
                Télécharger
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {deliverables.map((deliverable) => (
          <Card key={deliverable.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>{deliverable.title}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Étape: {deliverable.step}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {deliverable.grade && getGradeBadge(deliverable.grade)}
                  {getStatusBadge(deliverable.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Échéance: {new Date(deliverable.dueDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {deliverable.submittedDate && (
                    <div className="flex items-center space-x-1">
                      <span>Soumis le: {new Date(deliverable.submittedDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
                <span>Version: {deliverable.version}</span>
              </div>

              {deliverable.feedback && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-amber-700" />
                    <span className="font-medium text-amber-800">Feedback du Coach</span>
                  </div>
                  <p className="text-sm text-amber-700">{deliverable.feedback}</p>
                </div>
              )}

              {deliverable.files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Fichiers soumis:</h4>
                  {deliverable.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({file.size})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-2">
                {deliverable.status !== "pending" && (
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Nouvelle Version
                  </Button>
                )}
                {deliverable.status === "in-progress" && (
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Soumettre
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discuter
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
