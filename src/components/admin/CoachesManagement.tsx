
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Search, GraduationCap } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CoachFormData {
  name: string;
  email: string;
  status: "active" | "inactive";
  specialties?: string[];
}

export function CoachesManagement() {
  const { coaches, groups, addCoach, updateCoach, deleteCoach } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<any>(null);
  const [formData, setFormData] = useState<CoachFormData>({
    name: "",
    email: "",
    status: "active",
    specialties: []
  });

  const filteredCoaches = coaches.filter(coach =>
    coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCoach) {
      updateCoach(editingCoach.id, formData);
      toast.success("Coach modifié avec succès");
    } else {
      const newCoach = {
        id: Date.now(),
        ...formData
      };
      addCoach(newCoach);
      toast.success("Coach créé avec succès");
    }
    
    setIsDialogOpen(false);
    setEditingCoach(null);
    setFormData({ name: "", email: "", status: "active", specialties: [] });
  };

  const handleEdit = (coach: any) => {
    setEditingCoach(coach);
    setFormData({
      name: coach.name,
      email: coach.email,
      status: coach.status,
      specialties: coach.specialties || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (coachId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce coach ?")) {
      deleteCoach(coachId);
      toast.success("Coach supprimé");
    }
  };

  const getAssignedGroups = (coachId: number) => {
    return groups.filter(group => group.coachId === coachId);
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Gestion des Coachs
              </CardTitle>
              <CardDescription>Gérer les comptes coachs et leurs spécialités</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                  setEditingCoach(null);
                  setFormData({ name: "", email: "", status: "active", specialties: [] });
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau coach
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCoach ? "Modifier" : "Créer"} un coach</DialogTitle>
                  <DialogDescription>
                    {editingCoach ? "Modifiez" : "Ajoutez"} les informations du coach
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
                    <Label htmlFor="specialties">Spécialités (séparées par des virgules)</Label>
                    <Input
                      id="specialties"
                      value={formData.specialties?.join(", ") || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        specialties: e.target.value.split(",").map(s => s.trim()).filter(s => s.length > 0)
                      })}
                      placeholder="Ex: Entrepreneuriat, Innovation, Marketing"
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
                      {editingCoach ? "Modifier" : "Créer"}
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
                placeholder="Rechercher un coach..."
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
                <TableHead>Spécialités</TableHead>
                <TableHead>Groupes assignés</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoaches.map((coach) => (
                <TableRow key={coach.id}>
                  <TableCell className="font-medium">{coach.name}</TableCell>
                  <TableCell>{coach.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {coach.specialties?.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getAssignedGroups(coach.id).length} groupe(s)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={coach.status === "active" ? "default" : "secondary"}>
                      {coach.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(coach)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(coach.id)}>
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
