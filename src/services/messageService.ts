import { io, Socket } from 'socket.io-client';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Types pour les messages
export interface Message {
  id: number;
  sender: 'student' | 'coach' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: number;
  title: string;
  step: string;
  participant: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  isActive: boolean;
  messages: Message[];
}

// URL du serveur socket.io (u00e0 remplacer par l'URL ru00e9elle dans un environnement de production)
const SOCKET_URL = 'https://api.engage-educate-sphere.com';

// Comme nous n'avons pas de serveur ru00e9el, nous allons simuler la communication socket
// Dans une application de production, cette simulation serait remplacu00e9e par une connexion socket.io ru00e9elle
class MessageServiceSimulator {
  private callbacks: Record<string, Array<(data: any) => void>> = {};
  private conversations: Conversation[] = [];
  private connected = false;
  private userId?: number;
  private userRole?: string;
  
  constructor() {
    // Initialiser avec des conversations simulu00e9es
    this.conversations = [
      {
        id: 1,
        title: "Business Model Canvas - u00c9tape 3",
        step: "Business Model",
        participant: "Coach Martin",
        lastMessage: "Votre BMC est sur la bonne voie, quelques ajustements u00e0 pru00e9voir",
        lastMessageDate: "2024-01-20T14:30:00",
        unreadCount: 2,
        isActive: true,
        messages: [
          {
            id: 1,
            sender: "coach",
            senderName: "Coach Martin",
            content: "Bonjour ! J'ai regardu00e9 votre premiu00e8re version du Business Model Canvas. Globalement c'est bien parti !",
            timestamp: "2024-01-20T09:15:00",
            read: true
          },
          {
            id: 2,
            sender: "student",
            senderName: "Vous",
            content: "Merci ! J'ai quelques doutes sur la partie partenaires clu00e9s. Pourriez-vous m'aider ?",
            timestamp: "2024-01-20T10:30:00",
            read: true
          },
          {
            id: 3,
            sender: "coach",
            senderName: "Coach Martin",
            content: "Bien su00fbr ! Les partenaires clu00e9s sont essentiels pour votre modu00e8le. Pensez aux fournisseurs, distributeurs, ou partenaires technologiques qui vous permettront de cru00e9er et du00e9livrer votre proposition de valeur.",
            timestamp: "2024-01-20T11:45:00",
            read: true
          },
          {
            id: 4,
            sender: "coach",
            senderName: "Coach Martin",
            content: "Votre BMC est sur la bonne voie, quelques ajustements u00e0 pru00e9voir sur la structure de cou00fbts.",
            timestamp: "2024-01-20T14:30:00",
            read: false
          }
        ]
      },
      {
        id: 2,
        title: "Feedback Analyse de Marchu00e9",
        step: "u00c9tude de Marchu00e9",
        participant: "Coach Martin",
        lastMessage: "Excellent travail sur l'analyse de marchu00e9 !",
        lastMessageDate: "2024-01-18T16:20:00",
        unreadCount: 0,
        isActive: false,
        messages: [
          {
            id: 1,
            sender: "coach",
            senderName: "Coach Martin",
            content: "Votre analyse de marchu00e9 est tru00e8s complu00e8te. Les donnu00e9es chiffru00e9es apportent beaucoup de cru00e9dibilitu00e9. Continuez comme u00e7a !",
            timestamp: "2024-01-18T16:20:00",
            read: true
          },
          {
            id: 2,
            sender: "student",
            senderName: "Vous",
            content: "Merci beaucoup ! Cela m'a pris du temps mais j'ai appris u00e9normu00e9ment.",
            timestamp: "2024-01-18T17:15:00",
            read: true
          }
        ]
      }
    ];
  }

  // Simuler la connexion socket
  connect(userId: number, userRole: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Réduire le délai de connexion et s'assurer qu'elle s'établit correctement
      setTimeout(() => {
        this.userId = userId;
        this.userRole = userRole;
        this.connected = true;
        this.emit('connect', {});
        console.log('Connexion établie avec succès', { userId, userRole });
        resolve(true);
      }, 500); // Délai réduit pour une meilleure expérience utilisateur
    });
  }

  // Simuler la déconnexion
  disconnect(): void {
    this.connected = false;
    this.emit('disconnect', {});
  }

  // Obtenir toutes les conversations
  getConversations(): Conversation[] {
    return this.conversations;
  }

  // Envoyer un message
  sendMessage(conversationId: number, content: string, senderName: string): Promise<Message> {
    return new Promise(resolve => {
      const conversation = this.conversations.find(c => c.id === conversationId);
      if (!conversation) {
        throw new Error(`Conversation ${conversationId} not found`);
      }

      // Cru00e9er le nouveau message
      const newMessage: Message = {
        id: Date.now(),
        sender: this.userRole === 'student' ? 'student' : 'coach',
        senderName,
        content,
        timestamp: new Date().toISOString(),
        read: true
      };

      // Ajouter le message u00e0 la conversation
      conversation.messages.push(newMessage);
      conversation.lastMessage = content;
      conversation.lastMessageDate = newMessage.timestamp;

      // u00c9mettre l'u00e9vu00e9nement de nouveau message
      this.emit('newMessage', { conversationId, message: newMessage });

      // Simuler une ru00e9ponse du coach apru00e8s un du00e9lai (uniquement pour la du00e9mo)
      if (this.userRole === 'student') {
        this.simulateCoachResponse(conversationId);
      }

      resolve(newMessage);
    });
  }

  // Cru00e9er une nouvelle conversation
  createConversation(title: string, step: string, participant: string, initialMessage: string): Promise<Conversation> {
    return new Promise(resolve => {
      const newConvId = Math.max(...this.conversations.map(c => c.id), 0) + 1;
      const newMessage: Message = {
        id: 1,
        sender: this.userRole === 'student' ? 'student' : 'coach',
        senderName: this.userRole === 'student' ? 'Vous' : participant,
        content: initialMessage,
        timestamp: new Date().toISOString(),
        read: true
      };

      const newConversation: Conversation = {
        id: newConvId,
        title,
        step,
        participant,
        lastMessage: initialMessage,
        lastMessageDate: new Date().toISOString(),
        unreadCount: 0,
        isActive: true,
        messages: [newMessage]
      };

      this.conversations.unshift(newConversation);
      
      // u00c9mettre l'u00e9vu00e9nement de nouvelle conversation
      this.emit('newConversation', { conversation: newConversation });

      // Simuler une ru00e9ponse du coach apru00e8s un du00e9lai (uniquement pour la du00e9mo)
      if (this.userRole === 'student') {
        setTimeout(() => {
          this.simulateCoachResponse(newConvId);
        }, 10000); // 10 secondes
      }

      resolve(newConversation);
    });
  }

  // Mu00e9thode pour s'abonner u00e0 un u00e9vu00e9nement
  on(event: string, callback: (data: any) => void): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  // Mu00e9thode pour u00e9mettre un u00e9vu00e9nement
  private emit(event: string, data: any): void {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  // Simuler une ru00e9ponse du coach (uniquement pour la du00e9mo)
  private simulateCoachResponse(conversationId: number): void {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage.sender !== 'student') return; // Ne ru00e9pond que si le dernier message vient de l'u00e9tudiant

    setTimeout(() => {
      // Gu00e9nu00e9rer une ru00e9ponse simulu00e9e du coach
      const responses = [
        "C'est une excellente observation. Continuez u00e0 du00e9velopper cette idu00e9e.",
        "Avez-vous pensu00e9 u00e0 considu00e9rer l'aspect financier de cette approche?",
        "Je suis d'accord avec votre analyse. Essayez maintenant d'approfondir la partie concurrentielle.",
        "Tru00e8s bonne progression ! N'hu00e9sitez pas si vous avez d'autres questions.",
        "C'est un bon du00e9but, mais essayez de creuser davantage la proposition de valeur pour vos utilisateurs."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const coachMessage: Message = {
        id: Date.now(),
        sender: 'coach',
        senderName: conversation.participant,
        content: randomResponse,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Ajouter le message u00e0 la conversation
      conversation.messages.push(coachMessage);
      conversation.lastMessage = randomResponse;
      conversation.lastMessageDate = coachMessage.timestamp;
      conversation.unreadCount += 1;
      
      // u00c9mettre l'u00e9vu00e9nement de nouveau message
      this.emit('newMessage', { conversationId, message: coachMessage });
    }, Math.random() * 10000 + 5000); // Ru00e9ponse entre 5 et 15 secondes
  }

  // Du00e9marrer la simulation pu00e9riodique de messages du coach
  private startCoachSimulation(): void {
    // Toutes les 20-40 secondes, envoyer un message proactif du coach dans une conversation existante
    setInterval(() => {
      if (!this.connected) return;
      
      // 30% de chance d'envoyer un message
      if (Math.random() > 0.3) return;
      
      const activeConversations = this.conversations.filter(c => c.isActive);
      if (activeConversations.length === 0) return;
      
      const randomConversation = activeConversations[Math.floor(Math.random() * activeConversations.length)];
      
      const proactiveMessages = [
        "Comment avancez-vous sur cette partie? Besoin d'aide?",
        "Je viens de consulter votre dernier livrable. Il y a quelques points u00e0 amu00e9liorer.",
        "N'oubliez pas l'u00e9chu00e9ance qui approche pour cette u00e9tape!",
        "Je viens de vous ajouter une nouvelle ressource qui pourrait vous aider.",
        "Je suis disponible pour une session de coaching si vous le souhaitez."
      ];
      
      const randomMessage = proactiveMessages[Math.floor(Math.random() * proactiveMessages.length)];
      
      const coachMessage: Message = {
        id: Date.now(),
        sender: 'coach',
        senderName: randomConversation.participant,
        content: randomMessage,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Ajouter le message u00e0 la conversation
      randomConversation.messages.push(coachMessage);
      randomConversation.lastMessage = randomMessage;
      randomConversation.lastMessageDate = coachMessage.timestamp;
      randomConversation.unreadCount += 1;
      
      // u00c9mettre l'u00e9vu00e9nement de nouveau message
      this.emit('newMessage', { conversationId: randomConversation.id, message: coachMessage });
    }, Math.random() * 20000 + 20000); // Entre 20 et 40 secondes
  }

  // Marquer tous les messages d'une conversation comme lus
  markConversationAsRead(conversationId: number): Promise<void> {
    return new Promise(resolve => {
      const conversation = this.conversations.find(c => c.id === conversationId);
      if (!conversation) {
        resolve();
        return;
      }

      conversation.messages.forEach(msg => {
        if (msg.sender !== (this.userRole === 'student' ? 'student' : 'coach')) {
          msg.read = true;
        }
      });
      
      conversation.unreadCount = 0;
      
      // u00c9mettre l'u00e9vu00e9nement de mise u00e0 jour de la conversation
      this.emit('conversationUpdate', { conversationId });
      
      resolve();
    });
  }
}

// Cru00e9er une instance du service de messagerie simulu00e9
const messageServiceInstance = new MessageServiceSimulator();

// Hook React pour utiliser le service de messagerie
export function useMessageService(userId?: number, userRole?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Connexion au service de messagerie
  useEffect(() => {
    if (!userId || !userRole) return;

    const connectToService = async () => {
      try {
        setLoading(true);
        await messageServiceInstance.connect(userId, userRole);
        setIsConnected(true);
        setConversations(messageServiceInstance.getConversations());
      } catch (err) {
        setError('Erreur de connexion au service de messagerie');
        toast.error('Erreur de connexion au service de messagerie');
      } finally {
        setLoading(false);
      }
    };

    connectToService();

    // u00c9couteurs d'u00e9vu00e9nements
    messageServiceInstance.on('connect', () => {
      setIsConnected(true);
    });

    messageServiceInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    messageServiceInstance.on('newMessage', ({ conversationId, message }) => {
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.id === conversationId) {
            const updatedMessages = [...conv.messages, message];
            let updatedUnreadCount = conv.unreadCount;
            
            // Incru00e9menter le compteur de non lus seulement si le message vient de l'autre partie
            if (message.sender !== (userRole === 'student' ? 'student' : 'coach') && !message.read) {
              updatedUnreadCount += 1;
            }
            
            return {
              ...conv,
              messages: updatedMessages,
              lastMessage: message.content,
              lastMessageDate: message.timestamp,
              unreadCount: updatedUnreadCount
            };
          }
          return conv;
        });
      });
    });

    messageServiceInstance.on('newConversation', ({ conversation }) => {
      setConversations(prevConversations => [conversation, ...prevConversations]);
    });

    messageServiceInstance.on('conversationUpdate', ({ conversationId }) => {
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map(msg => ({
                ...msg,
                read: msg.sender === (userRole === 'student' ? 'student' : 'coach') || true
              }))
            };
          }
          return conv;
        });
      });
    });

    return () => {
      messageServiceInstance.disconnect();
    };
  }, [userId, userRole]);

  // Fonction pour envoyer un message
  const sendMessage = useCallback(async (conversationId: number, content: string, senderName: string) => {
    if (!isConnected) {
      setError('Non connectu00e9 au service de messagerie');
      toast.error('Non connectu00e9 au service de messagerie');
      return null;
    }

    try {
      const message = await messageServiceInstance.sendMessage(conversationId, content, senderName);
      return message;
    } catch (err) {
      setError('Erreur lors de l\'envoi du message');
      toast.error('Erreur lors de l\'envoi du message');
      return null;
    }
  }, [isConnected]);

  // Fonction pour cru00e9er une nouvelle conversation
  const createConversation = useCallback(async (title: string, step: string, participant: string, initialMessage: string) => {
    if (!isConnected) {
      setError('Non connectu00e9 au service de messagerie');
      toast.error('Non connectu00e9 au service de messagerie');
      return null;
    }

    try {
      const conversation = await messageServiceInstance.createConversation(title, step, participant, initialMessage);
      return conversation;
    } catch (err) {
      setError('Erreur lors de la cru00e9ation de la conversation');
      toast.error('Erreur lors de la cru00e9ation de la conversation');
      return null;
    }
  }, [isConnected]);

  // Fonction pour marquer une conversation comme lue
  const markConversationAsRead = useCallback(async (conversationId: number) => {
    if (!isConnected) return;

    try {
      await messageServiceInstance.markConversationAsRead(conversationId);
    } catch (err) {
      console.error('Erreur lors du marquage de la conversation comme lue', err);
    }
  }, [isConnected]);

  return {
    isConnected,
    loading,
    error,
    conversations,
    sendMessage,
    createConversation,
    markConversationAsRead
  };
}
