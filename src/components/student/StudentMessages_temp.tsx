import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, User, UserCheck, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/store/useStore";
import { useMessageService, Conversation, Message } from "@/services/messageService";
import { toast } from "sonner";

export function StudentMessages() {
  const { user } = useAuth();
  const { students, groups, coaches } = useStore();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Récupérer l'étudiant actuel et son groupe
  const currentStudent = students.find(s => s.email === user?.email);
  const studentGroup = groups.find(g => g.studentIds.includes(currentStudent?.id || 0));
  const assignedCoach = coaches.find(c => c.id === studentGroup?.coachId);
  
  // Utiliser notre service de messagerie en temps réel
  const {
    isConnected,
    loading,
    error,
    conversations,
    sendMessage: sendMessageToService,
    createConversation,
    markConversationAsRead
  } = useMessageService(currentStudent?.id, user?.role);
  
  // Trouver la conversation sélectionnée
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  
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
    if (!newMessage.trim() || !selectedConversationId || !isConnected) return;
    
    try {
      // Récupérer le nom de l'étudiant depuis son email si firstName/lastName ne sont pas disponibles
      const senderName = currentStudent?.email.split('@')[0] || 'Étudiant';
      
      await sendMessageToService(
        selectedConversationId,
        newMessage,
        senderName
      );
      setNewMessage("");
    } catch (err) {
      toast.error("Erreur lors de l'envoi du message");
    }
  };
  
  // Gérer l'appui sur Entrée
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Faire défiler automatiquement vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, selectedConversationId]);
  
  // Marquer la conversation comme lue lorsqu'elle est sélectionnée
  useEffect(() => {
    if (selectedConversationId) {
      markConversationAsRead(selectedConversationId);
    }
  }, [selectedConversationId, markConversationAsRead]);
  
  // Sélectionner la première conversation par défaut si aucune n'est sélectionnée
  useEffect(() => {
    if (!loading && conversations.length > 0 && selectedConversationId === null) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [loading, conversations, selectedConversationId]);
  
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des conversations */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Discussions par Étape</span>
                {loading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-[500px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-[500px] p-4 text-center text-red-500">
                  Une erreur est survenue lors de la connexion au service de messagerie.
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex items-center justify-center h-[500px] p-4 text-center text-muted-foreground">
                  Aucune conversation. Cliquez sur "Demander l'aide du Coach" pour commencer.
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversationId === conv.id ? 'bg-amber-50 border-l-4 border-l-amber-700' : ''
                    }`}
                    onClick={() => setSelectedConversationId(conv.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{conv.title}</h3>
                      <div className="flex items-center space-x-2">
                        {!conv.read && (
                          <Badge variant="default" className="bg-amber-700 text-white text-xs h-5 px-2">
                            {conv.unreadCount}
                          </Badge>
                        )}
                        {conv.isActive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" title="Conversation active" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {conv.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(conv.lastMessageDate)}
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
                    <span>{selectedConversation.title}</span>
                    <p className="text-sm text-muted-foreground font-normal">
                      Étape: {selectedConversation.step}
                    </p>
                  </div>
                  <Badge variant="outline">{selectedConversation.participant}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.sender === 'student' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.sender === 'coach' && (
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-amber-700" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'student'
                              ? 'bg-amber-700 text-white'
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
                        {message.sender === 'student' && (
                          <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={!isConnected}
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={!newMessage.trim() || !isConnected}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {!isConnected && (
                    <p className="text-xs text-red-500 mt-2">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Connexion au service de messagerie en cours...
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
                    Sélectionnez une discussion pour voir vos échanges avec le coach
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
