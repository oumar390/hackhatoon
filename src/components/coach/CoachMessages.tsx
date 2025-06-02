import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, User, UserCheck, Clock, Loader2, AlertCircle, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/store/useStore";
import { useMessageService, Conversation, Message } from "@/services/messageService";
import { toast } from "sonner";

export function CoachMessages() {
  const { user } = useAuth();
  const { students, groups, coaches } = useStore();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "recent">("all");
  const [manuallyConnected, setManuallyConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Récupérer le coach actuel (l'utilisateur connecté)
  const currentCoach = coaches.find(c => c.email === user?.email);
  
  // Utiliser notre service de messagerie en temps réel
  const {
    isConnected,
    loading,
    error,
    conversations,
    sendMessage: sendMessageToService,
    createConversation,
    markConversationAsRead
  } = useMessageService(currentCoach?.id || 1, user?.role || 'coach');
  
  // Conversations avec valeur par défaut pour éviter les erreurs
  const safeConversations = conversations || [];
  
  // Trouver les groupes gérés par ce coach
  const coachGroups = groups.filter(g => g.coachId === currentCoach?.id);
  
  // Obtenir les IDs des étudiants dans ces groupes
  const coachStudentIds = coachGroups.flatMap(g => g.studentIds);
  
  // Filtrer les conversations pertinentes pour ce coach
  const filteredConversations = safeConversations
    .filter(conv => {
      // Appliquer le filtre de recherche
      if (searchTerm && !conv.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !conv.participant.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Appliquer le filtre par catégorie
      if (filter === "unread" && conv.unreadCount === 0) {
        return false;
      }
      
      if (filter === "recent") {
        const lastMessageDate = new Date(conv.lastMessageDate);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        if (lastMessageDate < threeDaysAgo) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      // Trier par non lu puis par date
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime();
    });
  
  // Trouver la conversation sélectionnée
  const selectedConversation = safeConversations.find(c => c.id === selectedConversationId);
  
  // Obtenir les informations de l'étudiant pour la conversation sélectionnée
  const getStudentInfo = (participantName: string) => {
    const student = students.find(s => 
      `${s.firstName} ${s.lastName}` === participantName ||
      s.email.split('@')[0] === participantName
    );
    return student;
  };
  
  const studentInfo = selectedConversation 
    ? getStudentInfo(selectedConversation.participant) 
    : null;
  
  // Formatage de la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Si c'est aujourd'hui
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Si c'est hier
    if (date.toDateString() === yesterday.toDateString()) {
      return `Hier, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Sinon afficher la date complète
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Envoyer un message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;
    
    try {
      // Récupérer le nom du coach
      const senderName = currentCoach 
        ? `Coach ${currentCoach.lastName}` 
        : user?.email?.split('@')[0] || 'Coach';
      
      await sendMessageToService(
        selectedConversationId,
        newMessage,
        senderName
      );
      setNewMessage("");
    } catch (err) {
      toast.error("Erreur lors de l'envoi du message");
      console.error("Erreur d'envoi:", err);
    }
  };
  
  // Gérer l'appui sur Entrée
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Forcer la connexion manuellement
  const connectManually = () => {
    setManuallyConnected(true);
    toast.success("Tentative de reconnexion en cours...");
  };
  
  // Faire défiler automatiquement vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [safeConversations, selectedConversationId]);
  
  // Marquer la conversation comme lue lorsqu'elle est sélectionnée
  useEffect(() => {
    if (selectedConversationId && (isConnected || manuallyConnected)) {
      markConversationAsRead(selectedConversationId);
    }
  }, [selectedConversationId, markConversationAsRead, isConnected, manuallyConnected]);
  
  // Sélectionner la première conversation par défaut si aucune n'est sélectionnée
  useEffect(() => {
    if (!loading && filteredConversations.length > 0 && selectedConversationId === null) {
      setSelectedConversationId(filteredConversations[0].id);
    }
  }, [loading, filteredConversations, selectedConversationId]);
  
  // Déterminer si nous devrions afficher les messages (connexion réussie ou forcée manuellement)
  const shouldShowMessages = isConnected || manuallyConnected;
  
  // Statistiques sur les messages
  const totalUnread = safeConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const totalConversations = safeConversations.length;
  const activeConversations = safeConversations.filter(conv => conv.isActive).length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Messages des Étudiants</h2>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50">
            {totalUnread} non lus
          </Badge>
          <Badge variant="outline">
            {activeConversations} conversations actives
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des conversations */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="space-y-2 pb-2">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Conversations</span>
                {loading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              </CardTitle>
              
              {/* Recherche et filtres */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou sujet..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs 
                defaultValue="all" 
                value={filter}
                onValueChange={(value) => setFilter(value as "all" | "unread" | "recent")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="unread">Non lus</TabsTrigger>
                  <TabsTrigger value="recent">Récents</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="p-0">
              {loading && !manuallyConnected ? (
                <div className="flex flex-col items-center justify-center h-[600px] p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">Chargement des conversations...</p>
                  <Button onClick={connectManually} variant="outline" size="sm" className="mt-4">
                    Forcer la connexion
                  </Button>
                </div>
              ) : error && !manuallyConnected ? (
                <div className="flex flex-col items-center justify-center h-[600px] p-4">
                  <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
                  <p className="text-center text-red-500 mb-2">
                    Erreur de connexion au service de messagerie
                  </p>
                  <Button onClick={connectManually} variant="outline" size="sm">
                    Essayer quand même
                  </Button>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[600px] p-4">
                  <MessageSquare className="h-8 w-8 text-gray-400 mb-4" />
                  <p className="text-center text-muted-foreground">
                    {searchTerm || filter !== "all" 
                      ? "Aucune conversation ne correspond à vos critères"
                      : "Vous n'avez pas encore de conversations"}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversationId === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-700' : ''
                      }`}
                      onClick={() => setSelectedConversationId(conv.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm">{conv.participant}</h3>
                        <div className="flex items-center space-x-2">
                          {conv.unreadCount > 0 && (
                            <Badge variant="default" className="bg-blue-600 text-white text-xs h-5 px-2">
                              {conv.unreadCount}
                            </Badge>
                          )}
                          {conv.isActive && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" title="Conversation active" />
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[70%]">
                          {conv.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(conv.lastMessageDate)}
                        </p>
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {conv.title}
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Conversation sélectionnée */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <span>{selectedConversation.participant}</span>
                    <p className="text-sm text-muted-foreground font-normal flex items-center gap-1">
                      {selectedConversation.title}
                      {studentInfo?.isActive && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 ml-2 text-xs">
                          Actif
                        </Badge>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="outline">{selectedConversation.step}</Badge>
                    {studentInfo && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {studentInfo.email}
                      </p>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.sender === 'coach' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.sender === 'student' && (
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-700" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'coach'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-70">
                              {message.senderName}
                            </p>
                            <p className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        {message.sender === 'coach' && (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* La barre de chat reste toujours visible */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={!shouldShowMessages}
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={!newMessage.trim() || !shouldShowMessages}
                    >
                      {loading && !manuallyConnected ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {!isConnected && !manuallyConnected && (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-red-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Connexion au service de messagerie en cours...
                      </p>
                      <Button 
                        onClick={connectManually} 
                        variant="ghost" 
                        size="sm"
                        className="text-xs"
                      >
                        Forcer l'utilisation
                      </Button>
                    </div>
                  )}
                  {manuallyConnected && !isConnected && (
                    <p className="text-xs text-blue-500 mt-2">
                      Mode dégradé actif - certaines fonctionnalités peuvent être limitées
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Sélectionnez une conversation pour voir vos échanges avec l'étudiant
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
