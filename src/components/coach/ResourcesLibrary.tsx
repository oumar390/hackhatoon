import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Book, FileText, Video, Bookmark, Download, Search, Plus, Tag, Filter } from "lucide-react";

// Définir les interfaces pour les ressources
interface Resource {
  id: number;
  title: string;
  description: string;
  type: "document" | "video" | "article";
  url: string;
  dateAdded: string;
  courseId?: number;
  tags: string[];
}

// Ressources simulées
const mockResources: Resource[] = [
  {
    id: 1,
    title: "Introduction au Business Model Canvas",
    description: "Document PDF présentant les bases du BMC",
    type: "document",
    url: "#",
    dateAdded: "2023-09-15",
    courseId: 1,
    tags: ["entrepreneuriat", "business model"]
  },
  {
    id: 2,
    title: "Vidéo explicative: Lean Startup",
    description: "Comprendre la méthodologie Lean Startup en 15 minutes",
    type: "video",
    url: "#",
    dateAdded: "2023-09-20",
    courseId: 1,
    tags: ["entrepreneuriat", "lean startup"]
  },
  {
    id: 3,
    title: "Article: Techniques d'étude de marché",
    description: "Les meilleures pratiques pour réaliser une étude de marché efficace",
    type: "article",
    url: "#",
    dateAdded: "2023-10-05",
    courseId: 2,
    tags: ["marketing", "étude de marché"]
  },
  {
    id: 4,
    title: "Guide complet du pitch",
    description: "Comment créer et présenter un pitch efficace pour votre projet",
    type: "document",
    url: "#",
    dateAdded: "2023-10-12",
    courseId: 3,
    tags: ["communication", "pitch"]
  },
  {
    id: 5,
    title: "Webinaire: Financement de startups",
    description: "Enregistrement du webinaire sur les différentes options de financement",
    type: "video",
    url: "#",
    dateAdded: "2023-10-18",
    courseId: 3,
    tags: ["financement", "investissement"]
  },
];

export function ResourcesLibrary() {
  const { user } = useAuth();
  const { courses, groups, coaches } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [resources] = useState<Resource[]>(mockResources);
  
  // Récupérer le coach actuel
  const currentCoach = coaches.find(c => c.email === user?.email);
  
  // Récupérer les cours gérés par ce coach (pour le filtrage)
  const coachCourses = courses.filter(course => {
    // Dans un vrai scénario, les cours seraient liés aux groupes ou au coach directement
    // Pour cet exemple, on prend tous les cours disponibles
    return true;
  });
  
  // Filtrer les ressources
  const filteredResources = resources.filter(resource => {
    // Filtre par recherche
    const matchesSearch = searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filtre par type
    const matchesType = selectedType === null || resource.type === selectedType;
    
    // Filtre par cours
    const matchesCourse = selectedCourse === null || resource.courseId === selectedCourse;
    
    return matchesSearch && matchesType && matchesCourse;
  });
  
  const getResourceIcon = (type: string) => {
    switch(type) {
      case "document":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "article":
        return <Book className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-2xl font-bold">Bibliothèque de Ressources</h2>
        <p className="text-muted-foreground">
          Gérez et partagez des ressources pédagogiques avec vos étudiants
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une ressource..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtres
        </Button>
        
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle ressource
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" onClick={() => setSelectedType(null)}>Toutes</TabsTrigger>
          <TabsTrigger value="document" onClick={() => setSelectedType("document")}>Documents</TabsTrigger>
          <TabsTrigger value="video" onClick={() => setSelectedType("video")}>Vidéos</TabsTrigger>
          <TabsTrigger value="article" onClick={() => setSelectedType("article")}>Articles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map(resource => (
              <Card key={resource.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full p-1 bg-amber-100">
                        {getResourceIcon(resource.type)}
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="pt-1 line-clamp-2">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, idx) => (
                      <Badge variant="secondary" key={idx}>
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-xs text-muted-foreground">
                    Ajouté le {new Date(resource.dateAdded).toLocaleDateString('fr-FR')}
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-3 w-3" />
                    Télécharger
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune ressource trouvée</p>
            </div>
          )}
        </TabsContent>
        
        {["document", "video", "article"].map(type => (
          <TabsContent key={type} value={type} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources
                .filter(resource => resource.type === type)
                .map(resource => (
                  <Card key={resource.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full p-1 bg-amber-100">
                            {getResourceIcon(resource.type)}
                          </div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="pt-1 line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-2">
                        {resource.tags.map((tag, idx) => (
                          <Badge variant="secondary" key={idx}>
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-xs text-muted-foreground">
                        Ajouté le {new Date(resource.dateAdded).toLocaleDateString('fr-FR')}
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-3 w-3" />
                        Télécharger
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
            
            {filteredResources.filter(resource => resource.type === type).length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune ressource trouvée</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
