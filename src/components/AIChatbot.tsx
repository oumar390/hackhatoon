import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Initialiser le chat avec un message de bienvenue
  useEffect(() => {
    setMessages([
      {
        id: "1",
        text: "Bonjour ! Je suis votre assistant IA pédagogique. Comment puis-je vous aider avec votre parcours d'entrepreneuriat ?",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
  }, []);
  
  // Faire défiler automatiquement vers le bas lors de nouveaux messages
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      // Utiliser setTimeout pour s'assurer que le rendu est terminé avant de défiler
      setTimeout(() => {
        const scrollableElement = scrollContainer.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollableElement) {
          scrollableElement.scrollTop = scrollableElement.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Stocker l'historique des messages pour l'API Mistral
  const getMistralMessages = () => {
    // Limiter à 6 derniers messages pour optimiser les performances et accélérer les réponses
    const recentMessages = messages.slice(-6);
    return recentMessages.map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    }));
  };
  
  const MISTRAL_API_KEY = "0yLBIqf2TrfjEH5R1GrSoIRlZycKCt3c";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Préparer les messages avec l'historique de la conversation
      const mistralMessages = getMistralMessages();
      
      // Ajouter le nouveau message de l'utilisateur
      mistralMessages.push({
        role: 'user',
        content: input
      });
      
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [
            // Message système pour définir le contexte
            {
              role: 'system',
              content: 'Tu es un assistant IA spécialisé dans l\'accompagnement pédagogique en entrepreneuriat. Tu dois répondre en français de manière constructive, très concise et pédagogique. Limite tes réponses à 3-4 phrases maximum. Tu connais parfaitement les étapes de pré-incubation et d\'incubation de projets entrepreneuriaux.'
            },
            ...mistralMessages
          ],
          max_tokens: 250, // Réduit pour obtenir des réponses plus rapides
          temperature: 0.5, // Réduit pour des réponses plus concises et cohérentes
          top_p: 0.9, // Améliore la qualité tout en gardant une bonne vitesse
          stream: false // Pas de streaming pour éviter les problèmes d'affichage
        })
      });

      if (!response.ok) {
        throw new Error('Erreur API Mistral');
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "Je suis désolé, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler votre question ?";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Je rencontre actuellement des difficultés techniques. Voici quelques conseils généraux : concentrez-vous sur la validation de votre idée avec des clients potentiels, documentez bien vos recherches, et n'hésitez pas à contacter votre coach pour un accompagnement personnalisé.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
      toast.error("Connexion limitée - réponse générique fournie");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Assistant IA Pédagogique
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4 h-full overflow-auto" ref={scrollRef} type="always">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "ai" && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-700" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg overflow-y-auto ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-900"
                  }`}
                  style={{ maxHeight: '200px' }} // Limite la hauteur max des bulles
                >
                  <div className="text-sm whitespace-pre-wrap break-words">{message.text}</div>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-700 animate-pulse" />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-900">Je réfléchis...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-2 border-t">
          {/* Boutons de réponse rapide */}
          <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-blue-100">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800"
              onClick={() => setInput("Comment structurer mon business model ?")}
              disabled={isLoading}
            >
              Business model
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800"
              onClick={() => setInput("Qu'est-ce qu'un MVP ?")}
              disabled={isLoading}
            >
              MVP
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800"
              onClick={() => setInput("Comment trouver mes premiers clients ?")}
              disabled={isLoading}
            >
              Clients
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800"
              onClick={() => setInput("Comment pitcher mon projet ?")}
              disabled={isLoading}
            >
              Pitch
            </Button>
          </div>
          
          {/* Zone de saisie */}
          <div className="flex gap-2 px-2">
            <Input
              placeholder="Posez votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="h-10 border-blue-200 focus-visible:ring-blue-500"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-10 w-10 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
