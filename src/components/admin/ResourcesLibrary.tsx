
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Search, Plus, Trash2, Edit, Image, Video, FileIcon, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ProductivityTools } from "@/components/resources/ProductivityTools";
import { Separator } from "@/components/ui/separator";

export function ResourcesLibrary() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    category: "",
    file: null as File | null
  });

  // Ressources simulées avec différents types
  const resources = [
    {
      id: 1,
      title: "Guide du Business Model Canvas",
      description: "Document complet pour comprendre et remplir le BMC",
      category: "business-model",
      type: "pdf",
      size: "2.4 MB",
      downloadCount: 156,
      uploadDate: "2024-01-15",
      author: "Prof. Martin Durand"
    },
    {
      id: 2,
      title: "Template d'étude de marché",
      description: "Modèle Excel pour structurer votre analyse de marché",
      category: "market-research",
      type: "excel",
      size: "856 KB",
      downloadCount: 89,
      uploadDate: "2024-01-10",
      author: "Dr. Sarah Lefebvre"
    },
    {
      id: 3,
      title: "Vidéo : Pitch efficace",
      description: "Techniques pour présenter votre projet en 3 minutes",
      category: "presentation",
      type: "video",
      size: "125 MB",
      downloadCount: 234,
      uploadDate: "2024-01-08",
      author: "Coach Pierre Martin"
    },
    {
      id: 4,
      title: "Checklist validation d'idée",
      description: "Liste de vérification pour valider votre concept",
      category: "ideation",
      type: "pdf",
      size: "1.2 MB",
      downloadCount: 178,
      uploadDate: "2024-01-05",
      author: "Équipe pédagogique"
    }
  ];

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "ideation", label: "Idéation" },
    { value: "market-research", label: "Étude de marché" },
    { value: "business-model", label: "Business Model" },
    { value: "prototype", label: "Prototypage" },
    { value: "presentation", label: "Présentation" },
    { value: "general", label: "Général" }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "excel":
        return <FileIcon className="h-8 w-8 text-green-500" />;
      case "video":
        return <Video className="h-8 w-8 text-purple-500" />;
      case "image":
        return <Image className="h-8 w-8 text-amber-600" />;
      default:
        return <BookOpen className="h-8 w-8 text-gray-500" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    if (!newResource.title || !newResource.file) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Simulation d'upload
    toast.success("Ressource ajoutée avec succès !");
    setNewResource({ title: "", description: "", category: "", file: null });
    setIsUploadOpen(false);
  };

  const handleDownload = (resourceId: number, title: string) => {
    toast.success(`Téléchargement de "${title}" commencé`);
  };

  const handleDelete = (resourceId: number, title: string) => {
    toast.success(`Ressource "${title}" supprimée`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bibliothèque de Ressources</h1>
        {!isStudent && (
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une Ressource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une Nouvelle Ressource</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre *</label>
                  <Input
                    placeholder="Titre de la ressource"
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    placeholder="Description de la ressource"
                    value={newResource.description}
                    onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie</label>
                  <Select
                    value={newResource.category}
                    onValueChange={(value) => setNewResource({...newResource, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fichier *</label>
                  <Input
                    type="file"
                    onChange={(e) => setNewResource({...newResource, file: e.target.files?.[0] || null})}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.avi,.mov,.jpg,.jpeg,.png"
                  />
                </div>
                <Button onClick={handleUpload} className="w-full">
                  Télécharger la Ressource
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une ressource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grille des ressources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(resource.type)}
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {categories.find(c => c.value === resource.category)?.label}
                    </Badge>
                  </div>
                </div>
                {!isStudent && (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDelete(resource.id, resource.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{resource.description}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{resource.size}</span>
                <span>{resource.downloadCount} téléchargements</span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p>Ajouté le {new Date(resource.uploadDate).toLocaleDateString('fr-FR')}</p>
                <p>Par {resource.author}</p>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleDownload(resource.id, resource.title)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucune ressource trouvée pour ces critères
            </p>
          </CardContent>
        </Card>
      )}

      {/* Séparateur entre la bibliothèque et les outils externes */}
      <Separator className="my-10" />
      
      {/* Section des outils de productivité externes */}
      <ProductivityTools />
    </div>
  );
}
