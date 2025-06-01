
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Calendar as CalendarIcon, AlertTriangle, CheckCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Deadline {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  type: "collective" | "individual";
  targetIds: number[]; // groupIds pour collective, studentIds pour individual
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "overdue";
  createdAt: Date;
}

export function DeadlineManagement() {
  const { groups, students } = useStore();
  const [deadlines, setDeadlines] = useState<Deadline[]>([
    {
      id: 1,
      title: "Livrable Prototype V1",
      description: "Première version du prototype fonctionnel",
      dueDate: new Date(2024, 2, 15),
      type: "collective",
      targetIds: [1],
      priority: "high",
      status: "pending",
      createdAt: new Date()
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "collective" as "collective" | "individual",
    targetIds: [] as number[],
    priority: "medium" as "low" | "medium" | "high"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast.error("Veuillez sélectionner une date");
      return;
    }

    if (editingDeadline) {
      setDeadlines(prev => prev.map(d => 
        d.id === editingDeadline.id 
          ? { ...d, ...formData, dueDate: selectedDate }
          : d
      ));
      toast.success("Deadline modifiée avec succès");
    } else {
      const newDeadline: Deadline = {
        id: Date.now(),
        ...formData,
        dueDate: selectedDate,
        status: "pending",
        createdAt: new Date()
      };
      setDeadlines(prev => [...prev, newDeadline]);
      toast.success("Deadline créée avec succès");
    }
    
    resetForm();
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingDeadline(null);
    setSelectedDate(undefined);
    setFormData({
      title: "",
      description: "",
      type: "collective",
      targetIds: [],
      priority: "medium"
    });
  };

  const handleEdit = (deadline: Deadline) => {
    setEditingDeadline(deadline);
    setFormData({
      title: deadline.title,
      description: deadline.description,
      type: deadline.type,
      targetIds: deadline.targetIds,
      priority: deadline.priority
    });
    setSelectedDate(deadline.dueDate);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette deadline ?")) {
      setDeadlines(prev => prev.filter(d => d.id !== id));
      toast.success("Deadline supprimée");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "overdue": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CalendarIcon className="h-4 w-4 text-amber-700" />;
    }
  };

  const getTargetNames = (deadline: Deadline) => {
    if (deadline.type === "collective") {
      return deadline.targetIds.map(id => {
        const group = groups.find(g => g.id === id);
        return group?.name || "Groupe inconnu";
      }).join(", ");
    } else {
      return deadline.targetIds.map(id => {
        const student = students.find(s => s.id === id);
        return student?.name || "Étudiant inconnu";
      }).join(", ");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Gestion des Deadlines
              </CardTitle>
              <CardDescription>Planifiez et suivez les échéances importantes</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-700 hover:bg-amber-800" onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle deadline
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingDeadline ? "Modifier" : "Créer"} une deadline
                  </DialogTitle>
                  <DialogDescription>
                    Définissez une échéance pour un groupe ou des étudiants spécifiques
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priorité</Label>
                      <Select value={formData.priority} onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Élevée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={formData.type} onValueChange={(value: "collective" | "individual") => setFormData({ ...formData, type: value, targetIds: [] })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collective">Collective (Groupe)</SelectItem>
                          <SelectItem value="individual">Individuelle (Étudiant)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date d'échéance</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label>Cibles</Label>
                    <Select 
                      value={formData.targetIds.length > 0 ? formData.targetIds[0].toString() : ""} 
                      onValueChange={(value) => setFormData({ ...formData, targetIds: [parseInt(value)] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.type === "collective" ? "Sélectionner un groupe" : "Sélectionner un étudiant"} />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.type === "collective" ? (
                          groups.map(group => (
                            <SelectItem key={group.id} value={group.id.toString()}>
                              {group.name}
                            </SelectItem>
                          ))
                        ) : (
                          students.map(student => (
                            <SelectItem key={student.id} value={student.id.toString()}>
                              {student.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
                      {editingDeadline ? "Modifier" : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Tableau des deadlines */}
      <Card className="border-blue-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cibles</TableHead>
                <TableHead>Date d'échéance</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deadlines.map((deadline) => (
                <TableRow key={deadline.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{deadline.title}</div>
                      <div className="text-sm text-gray-500">{deadline.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {deadline.type === "collective" ? "Groupe" : "Individuel"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getTargetNames(deadline)}</TableCell>
                  <TableCell>
                    {format(deadline.dueDate, "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(deadline.priority) as any}>
                      {deadline.priority === "high" ? "Élevée" : deadline.priority === "medium" ? "Moyenne" : "Faible"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deadline.status)}
                      <span className="capitalize">{deadline.status === "pending" ? "En cours" : deadline.status === "completed" ? "Terminé" : "En retard"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(deadline)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(deadline.id)}>
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
