import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

// Import des icu00f4nes personnalisu00e9es
import {
  FigmaIcon,
  CanvaIcon,
  SlackIcon,
  TrelloIcon,
  NotionIcon,
  MiroIcon,
  GitHubIcon,
  GitLabIcon,
  AsanaIcon,
  GoogleWorkspaceIcon
} from "@/components/icons/ProductivityIcons";

type ProductivityTool = {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: React.ReactNode;
};

export function ProductivityTools() {
  const productivityTools: ProductivityTool[] = [
    {
      id: 1,
      name: "Figma",
      description: "Outil de conception d'interface collaboratif pour créer des maquettes et prototypes interactifs",
      url: "https://www.figma.com/",
      category: "design",
      icon: <FigmaIcon />
    },
    {
      id: 2,
      name: "Canva",
      description: "Plateforme de conception graphique simplifiée pour créer des présentations, infographies et visuels",
      url: "https://www.canva.com/",
      category: "design",
      icon: <CanvaIcon />
    },
    {
      id: 3,
      name: "Slack",
      description: "Plateforme de communication d'u00e9quipe pour les messages, appels et partage de fichiers",
      url: "https://slack.com/",
      category: "communication",
      icon: <SlackIcon />
    },
    {
      id: 4,
      name: "Trello",
      description: "Outil de gestion de projet visuel basu00e9 sur des tableaux kanban pour organiser les tu00e2ches",
      url: "https://trello.com/",
      category: "gestion de projet",
      icon: <TrelloIcon />
    },
    {
      id: 5,
      name: "Notion",
      description: "Espace de travail tout-en-un pour les notes, bases de donnu00e9es, wikis et gestion de projet",
      url: "https://www.notion.so/",
      category: "organisation",
      icon: <NotionIcon />
    },
    {
      id: 6,
      name: "Miro",
      description: "Tableau blanc collaboratif en ligne pour le brainstorming et la visualisation d'idu00e9es",
      url: "https://miro.com/",
      category: "collaboration",
      icon: <MiroIcon />
    },
    {
      id: 7,
      name: "GitHub",
      description: "Plateforme de du00e9veloppement collaboratif et de gestion de code source",
      url: "https://github.com/",
      category: "du00e9veloppement",
      icon: <GitHubIcon />
    },
    {
      id: 8,
      name: "GitLab",
      description: "Plateforme DevOps complu00e8te pour la gestion de cycle de vie des logiciels",
      url: "https://gitlab.com/",
      category: "du00e9veloppement",
      icon: <GitLabIcon />
    },
    {
      id: 9,
      name: "Asana",
      description: "Outil de gestion de travail pour suivre, organiser et gu00e9rer les projets d'u00e9quipe",
      url: "https://asana.com/",
      category: "gestion de projet",
      icon: <AsanaIcon />
    },
    {
      id: 10,
      name: "Google Workspace",
      description: "Suite d'outils de productivitu00e9 comprenant Gmail, Docs, Drive, Calendar et Meet",
      url: "https://workspace.google.com/",
      category: "bureautique",
      icon: <GoogleWorkspaceIcon />
    }
  ];

  // Catu00e9gories disponibles pour le filtrage (u00e0 implu00e9menter si nu00e9cessaire)
  const categories = [
    { value: "all", label: "Tous les outils" },
    { value: "design", label: "Design" },
    { value: "communication", label: "Communication" },
    { value: "gestion de projet", label: "Gestion de projet" },
    { value: "organisation", label: "Organisation" },
    { value: "collaboration", label: "Collaboration" },
    { value: "du00e9veloppement", label: "Du00e9veloppement" },
    { value: "bureautique", label: "Bureautique" }
  ];

  const handleOpenTool = (url: string, toolName: string) => {
    window.open(url, '_blank');
    // On pourrait ajouter une notification ou un tracking ici
    console.log(`${toolName} ouvert dans un nouvel onglet`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Outils de Productivitu00e9 Externes</h2>
      <p className="text-muted-foreground">
        Accu00e9dez u00e0 ces outils professionnels pour amu00e9liorer votre productivitu00e9 et faciliter la collaboration de votre u00e9quipe.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productivityTools.map((tool) => (
          <Card 
            key={tool.id} 
            className="hover:shadow-md transition-shadow cursor-pointer" 
            onClick={() => handleOpenTool(tool.url, tool.name)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-50 p-2 rounded-md">
                  {tool.icon}
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center">
                    {tool.name}
                    <ExternalLink className="h-4 w-4 ml-2 text-muted-foreground" />
                  </CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {categories.find(c => c.value === tool.category)?.label || tool.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
