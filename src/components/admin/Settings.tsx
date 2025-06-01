
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Save, Shield, Bell, Database, Users } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SystemSettings {
  platformName: string;
  description: string;
  adminEmail: string;
  maxStudentsPerGroup: number;
  enableNotifications: boolean;
  enableLogging: boolean;
  autoBackup: boolean;
  maintenanceMode: boolean;
}

interface ActivityLog {
  id: number;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  type: "create" | "update" | "delete" | "access";
}

export function Settings() {
  const [settings, setSettings] = useState<SystemSettings>({
    platformName: "KSP Knowledge Share Platform",
    description: "Plateforme collaborative de partage de ressources pédagogiques",
    adminEmail: "admin@ksp.edu",
    maxStudentsPerGroup: 8,
    enableNotifications: true,
    enableLogging: true,
    autoBackup: true,
    maintenanceMode: false
  });

  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: 1,
      action: "Création d'un nouvel étudiant",
      user: "Admin",
      target: "Alice Martin",
      timestamp: "2024-01-15 14:30:25",
      type: "create"
    },
    {
      id: 2,
      action: "Modification du groupe",
      user: "Admin",
      target: "Groupe Alpha",
      timestamp: "2024-01-15 13:45:12",
      type: "update"
    },
    {
      id: 3,
      action: "Suppression de ressource",
      user: "Admin",
      target: "Document obsolète",
      timestamp: "2024-01-15 12:20:08",
      type: "delete"
    },
    {
      id: 4,
      action: "Accès au tableau de bord",
      user: "Prof. Martin Durand",
      target: "Dashboard Coach",
      timestamp: "2024-01-15 11:15:45",
      type: "access"
    }
  ]);

  const handleSaveSettings = () => {
    // Simulation de sauvegarde
    toast.success("Paramètres sauvegardés avec succès");
  };

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case "create": return "text-green-600";
      case "update": return "text-amber-700";
      case "delete": return "text-red-600";
      case "access": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const exportLogs = () => {
    // Simulation d'export des logs
    toast.success("Export des logs en cours...");
  };

  return (
    <div className="space-y-6">
      {/* Paramètres généraux */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Paramètres Généraux
          </CardTitle>
          <CardDescription>Configuration de la plateforme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platformName">Nom de la plateforme</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="adminEmail">Email administrateur</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="maxStudents">Nombre maximum d'étudiants par groupe</Label>
            <Input
              id="maxStudents"
              type="number"
              value={settings.maxStudentsPerGroup}
              onChange={(e) => setSettings({ ...settings, maxStudentsPerGroup: parseInt(e.target.value) })}
              min="1"
              max="20"
            />
          </div>

          <Button onClick={handleSaveSettings} className="bg-amber-700 hover:bg-amber-800">
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder les paramètres
          </Button>
        </CardContent>
      </Card>

      {/* Paramètres système */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Paramètres Système
          </CardTitle>
          <CardDescription>Configuration avancée et sécurité</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Notifications activées</Label>
              <p className="text-sm text-gray-500">Recevoir les notifications système</p>
            </div>
            <Switch
              id="notifications"
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="logging">Journalisation activée</Label>
              <p className="text-sm text-gray-500">Enregistrer les actions sensibles</p>
            </div>
            <Switch
              id="logging"
              checked={settings.enableLogging}
              onCheckedChange={(checked) => setSettings({ ...settings, enableLogging: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="backup">Sauvegarde automatique</Label>
              <p className="text-sm text-gray-500">Sauvegarde quotidienne des données</p>
            </div>
            <Switch
              id="backup"
              checked={settings.autoBackup}
              onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenance">Mode maintenance</Label>
              <p className="text-sm text-gray-500">Désactiver temporairement la plateforme</p>
            </div>
            <Switch
              id="maintenance"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Journal d'activité */}
      <Card className="border-amber-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <Database className="h-5 w-5" />
                Journal d'Activité
              </CardTitle>
              <CardDescription>Historique des actions sensibles</CardDescription>
            </div>
            <Button variant="outline" onClick={exportLogs}>
              Exporter les logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Cible</TableHead>
                <TableHead>Date/Heure</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>{log.target}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getActionTypeColor(log.type)}`}>
                      {log.type.toUpperCase()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Gestion des utilisateurs en masse */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion en Masse
          </CardTitle>
          <CardDescription>Opérations sur plusieurs utilisateurs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button variant="outline">
              Importer utilisateurs (CSV)
            </Button>
            <Button variant="outline">
              Exporter tous les utilisateurs
            </Button>
            <Button variant="outline">
              Désactiver utilisateurs inactifs
            </Button>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Attention :</strong> Les opérations en masse sont irréversibles. 
              Assurez-vous d'avoir une sauvegarde avant de procéder.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
