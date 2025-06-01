
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Search, Users, BookOpen } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StudentFormData {
  name: string;
  email: string;
  status: "active" | "inactive";
  pathway?: "pre-incubation" | "incubation";
  groupId?: number;
}

export function StudentsManagement() {
  const { students, groups, addStudent, updateStudent, deleteStudent } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    email: "",
    status: "active",
    pathway: "pre-incubation"
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
      toast.success("Étudiant modifié avec succès");
    } else {
      const newStudent = {
        id: Date.now(),
        ...formData
      };
      addStudent(newStudent);
      toast.success("Étudiant créé avec succès");
    }
    
    setIsDialogOpen(false);
    setEditingStudent(null);
    setFormData({ name: "", email: "", status: "active", pathway: "pre-incubation" });
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      status: student.status,
      pathway: student.pathway,
      groupId: student.groupId
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (studentId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      deleteStudent(studentId);
      toast.success("Étudiant supprimé");
    }
  };

  const getGroupName = (groupId?: number) => {
    if (!groupId) return "Aucun groupe";
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : "Groupe introuvable";
  };

  return (
    <div className="space-y-6">
      <Card className="border-amber-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestion des Étudiants
              </CardTitle>
              <CardDescription>Gérer les comptes étudiants et leurs inscriptions</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-700 hover:bg-amber-800" onClick={() => {
                  setEditingStudent(null);
                  setFormData({ name: "", email: "", status: "active", pathway: "pre-incubation" });
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel étudiant
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingStudent ? "Modifier" : "Créer"} un étudiant</DialogTitle>
                  <DialogDescription>
                    {editingStudent ? "Modifiez" : "Ajoutez"} les informations de l'étudiant
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pathway">Parcours</Label>
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
                    <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
                      {editingStudent ? "Modifier" : "Créer"}
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
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Parcours</TableHead>
                <TableHead>Groupe</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {student.pathway === "incubation" ? "Incubation" : "Pré-incubation"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getGroupName(student.groupId)}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === "active" ? "default" : "secondary"}>
                      {student.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(student.id)}>
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
