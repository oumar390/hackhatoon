import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function CoachingRequestManagement() {
  const { coachingRequests, groups, courses, coaches } = useStore();
  
  // Formater la date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
  };
  
  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">En attente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Approuvée</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejetée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Demandes de Coaching</h1>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Demandes de Coaching</CardTitle>
          <CardDescription>
            {coachingRequests.length} demande(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Groupe</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Coach</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coachingRequests.length > 0 ? (
                coachingRequests
                  .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
                  .map(request => {
                    const group = groups.find(g => g.id === request.groupId);
                    const course = courses.find(c => c.id === request.courseId);
                    const coach = coaches.find(c => c.id === request.coachId);
                    
                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          {group ? group.name : `Groupe #${request.groupId}`}
                        </TableCell>
                        <TableCell>
                          {course ? course.title : `Cours #${request.courseId}`}
                        </TableCell>
                        <TableCell>
                          {formatDate(request.requestDate)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell>
                          {coach ? `${coach.firstName} ${coach.lastName}` : "Non assigné"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {request.status === "pending" && (
                              <Button variant="outline" size="sm">
                                Assigner
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    Aucune demande trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
