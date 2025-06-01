
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

interface UserFormData {
  name: string;
  email: string;
  role: "student" | "coach";
  status: "active" | "inactive";
}

export function UserManagement() {
  const { students, coaches, addStudent, addCoach, updateStudent, updateCoach, deleteStudent, deleteCoach } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "student",
    status: "active"
  });

  const allUsers = [
    ...students.map(s => ({ ...s, role: "student" as const })),
    ...coaches.map(c => ({ ...c, role: "coach" as const }))
  ];

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Modification
      if (formData.role === "student") {
        updateStudent(editingUser.id, formData);
      } else if (formData.role === "coach") {
        updateCoach(editingUser.id, formData);
      }
      toast.success("Utilisateur modifié avec succès");
    } else {
      // Création
      const newUser = {
        id: Date.now(),
        ...formData
      };
      
      if (formData.role === "student") {
        addStudent(newUser);
      } else if (formData.role === "coach") {
        addCoach(newUser);
      }
      toast.success("Utilisateur créé avec succès");
    }
    
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "student", status: "active" });
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (user: any) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      if (user.role === "student") {
        deleteStudent(user.id);
      } else if (user.role === "coach") {
        deleteCoach(user.id);
      }
      toast.success("Utilisateur supprimé");
    }
  };

  return (
    <Card className="border-amber-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-amber-900">Gestion des Utilisateurs</CardTitle>
            <CardDescription>Créer, modifier et gérer les comptes utilisateurs</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-700 hover:bg-amber-800" onClick={() => {
                setEditingUser(null);
                setFormData({ name: "", email: "", role: "student", status: "active" });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Modifier" : "Créer"} un utilisateur</DialogTitle>
                <DialogDescription>
                  {editingUser ? "Modifiez" : "Ajoutez"} les informations de l'utilisateur
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
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={formData.role} onValueChange={(value: "student" | "coach") => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Étudiant</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
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
                    {editingUser ? "Modifier" : "Créer"}
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
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div key={`${user.role}-${user.id}`} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-700 font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={user.role === "coach" ? "secondary" : "outline"}>
                  {user.role === "coach" ? "Coach" : "Étudiant"}
                </Badge>
                <Badge variant={user.status === "active" ? "default" : "secondary"}>
                  {user.status === "active" ? "Actif" : "Inactif"}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(user)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
