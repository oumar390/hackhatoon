
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Search, BookOpen, Target } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Course {
  id: number;
  title: string;
  description: string;
  pathway: "pre-incubation" | "incubation";
  duration: string;
  objectives: string[];
  status: "active" | "inactive";
  createdAt: string;
}

interface CourseFormData {
  title: string;
  description: string;
  pathway: "pre-incubation" | "incubation";
  duration: string;
  objectives: string[];
  status: "active" | "inactive";
}

export function CoursesManagement() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Idéation et Validation d'Idée",
      description: "Méthodes pour générer et valider des idées d'entreprise",
      pathway: "pre-incubation",
      duration: "4 semaines",
      objectives: ["Techniques de brainstorming", "Analyse de marché", "Business Model Canvas"],
      status: "active",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Développement de Prototype",
      description: "Création et test de prototypes",
      pathway: "incubation",
      duration: "6 semaines",
      objectives: ["Prototypage rapide", "Tests utilisateurs", "Itération"],
      status: "active",
      createdAt: "2024-01-10"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    pathway: "pre-incubation",
    duration: "",
    objectives: [],
    status: "active"
  });

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCourse) {
      setCourses(courses.map(course => 
        course.id === editingCourse.id 
          ? { ...course, ...formData }
          : course
      ));
      toast.success("Parcours modifié avec succès");
    } else {
      const newCourse: Course = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setCourses([...courses, newCourse]);
      toast.success("Parcours créé avec succès");
    }
    
    setIsDialogOpen(false);
    setEditingCourse(null);
    setFormData({ title: "", description: "", pathway: "pre-incubation", duration: "", objectives: [], status: "active" });
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      pathway: course.pathway,
      duration: course.duration,
      objectives: course.objectives,
      status: course.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (courseId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce parcours ?")) {
      setCourses(courses.filter(course => course.id !== courseId));
      toast.success("Parcours supprimé");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Gestion des Parcours
              </CardTitle>
              <CardDescription>Créer et gérer les parcours pédagogiques</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                  setEditingCourse(null);
                  setFormData({ title: "", description: "", pathway: "pre-incubation", duration: "", objectives: [], status: "active" });
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau parcours
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingCourse ? "Modifier" : "Créer"} un parcours</DialogTitle>
                  <DialogDescription>
                    {editingCourse ? "Modifiez" : "Configurez"} le parcours pédagogique
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre du parcours</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pathway">Type de parcours</Label>
                      <Select value={formData.pathway} onValueChange={(value: "pre-incubation" | "incubation") => setFormData({ ...formData, pathway: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre-incubation">Pré-incubation</SelectItem>
                          <SelectItem value="incubation">Incubation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Durée</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="Ex: 4 semaines"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="objectives">Objectifs (séparés par des virgules)</Label>
                    <Textarea
                      id="objectives"
                      value={formData.objectives.join(", ")}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        objectives: e.target.value.split(",").map(s => s.trim()).filter(s => s.length > 0)
                      })}
                      placeholder="Ex: Analyse de marché, Business Model Canvas"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      {editingCourse ? "Modifier" : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un parcours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Objectifs</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {course.pathway === "incubation" ? "Incubation" : "Pré-incubation"}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {course.objectives.slice(0, 2).map((objective, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {objective}
                        </Badge>
                      ))}
                      {course.objectives.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{course.objectives.length - 2} autres
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.status === "active" ? "default" : "secondary"}>
                      {course.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(course)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(course.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
