
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

interface GroupFormData {
  name: string;
  pathway: "pre-incubation" | "incubation";
  coachId: number | null;
  studentIds: number[];
}

export function GroupManagement() {
  const { groups, students, coaches, addGroup, updateGroup, deleteGroup } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [formData, setFormData] = useState<GroupFormData>({
    name: "",
    pathway: "pre-incubation",
    coachId: null,
    studentIds: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGroup) {
      updateGroup(editingGroup.id, formData);
      toast.success("Groupe modifié avec succès");
    } else {
      const newGroup = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      addGroup(newGroup);
      toast.success("Groupe créé avec succès");
    }
    
    setIsDialogOpen(false);
    setEditingGroup(null);
    setFormData({ name: "", pathway: "pre-incubation", coachId: null, studentIds: [] });
  };

  const handleEdit = (group: any) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      pathway: group.pathway,
      coachId: group.coachId,
      studentIds: group.studentIds
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (groupId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      deleteGroup(groupId);
      toast.success("Groupe supprimé");
    }
  };

  const handleStudentToggle = (studentId: number, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, studentIds: [...formData.studentIds, studentId] });
    } else {
      setFormData({ ...formData, studentIds: formData.studentIds.filter(id => id !== studentId) });
    }
  };

  return (
    <Card className="border-amber-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-amber-900">Gestion des Groupes</CardTitle>
            <CardDescription>Créer et gérer les groupes de projet</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-700 hover:bg-amber-800" onClick={() => {
                setEditingGroup(null);
                setFormData({ name: "", pathway: "pre-incubation", coachId: null, studentIds: [] });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau groupe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingGroup ? "Modifier" : "Créer"} un groupe</DialogTitle>
                <DialogDescription>
                  {editingGroup ? "Modifiez" : "Configurez"} les paramètres du groupe
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du groupe</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Groupe Alpha - Promo 2024"
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
                  <Label htmlFor="coach">Coach assigné</Label>
                  <Select value={formData.coachId?.toString() || ""} onValueChange={(value) => setFormData({ ...formData, coachId: value ? parseInt(value) : null })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un coach" />
                    </SelectTrigger>
                    <SelectContent>
                      {coaches.map((coach) => (
                        <SelectItem key={coach.id} value={coach.id.toString()}>
                          {coach.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Étudiants membres</Label>
                  <div className="max-h-48 overflow-y-auto space-y-2 border rounded p-2">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={formData.studentIds.includes(student.id)}
                          onCheckedChange={(checked) => handleStudentToggle(student.id, checked as boolean)}
                        />
                        <label htmlFor={`student-${student.id}`} className="text-sm">
                          {student.name} ({student.email})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
                    {editingGroup ? "Modifier" : "Créer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{group.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{group.pathway}</Badge>
                      <span className="text-sm text-gray-500">
                        {group.studentIds.length} étudiant(s)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(group)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(group.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Coach: </span>
                  {group.coachId ? 
                    coaches.find(c => c.id === group.coachId)?.name || "Non assigné" 
                    : "Non assigné"
                  }
                </div>
                <div>
                  <span className="font-medium">Membres: </span>
                  {group.studentIds.map(id => 
                    students.find(s => s.id === id)?.name
                  ).filter(Boolean).join(", ") || "Aucun membre"}
                </div>
              </div>
            </div>
          ))}
          
          {groups.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun groupe créé pour le moment
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
