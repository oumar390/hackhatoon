
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, MessageCircle, Bot, BarChart3, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Parcours Structurés",
      description: "Pré-incubation et incubation avec progression claire"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Chat Contextuel",
      description: "Discussion directe avec vos coachs par étape"
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Assistant IA",
      description: "Aide pédagogique intelligente disponible 24/7"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Suivi Progression",
      description: "Frise dynamique avec pourcentage d'avancement"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Ressources Pédagogiques",
      description: "Bibliothèque complète par étape et parcours"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Gestion Multi-rôles",
      description: "Interface adaptée pour étudiants, coachs et admins"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/e2c6ea7a-dc40-403f-ac09-bf6db57ad4e7.png" 
                alt="Knowledge Share Platform" 
                className="h-10 w-10 rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-amber-900">Knowledge Share Platform</h1>
                <p className="text-xs text-amber-700">Engage • Educate • Sphere</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-amber-200 text-amber-800 hover:bg-amber-50"
              >
                Se connecter
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => navigate('/dashboard')}
              >
                Accéder au Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-amber-900 mb-6">
            Accompagnez vos projets 
            <span className="text-green-600"> étudiants</span>
          </h2>
          <p className="text-xl text-amber-700 mb-8 max-w-2xl mx-auto">
            Plateforme complète de suivi pédagogique pour l'enseignement supérieur. 
            Parcours structurés, coaching personnalisé et assistant IA intégré.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => navigate('/dashboard')}
            >
              <Users className="mr-2 h-5 w-5" />
              Démarrer maintenant
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-amber-300 text-amber-800 hover:bg-amber-50"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Découvrir les parcours
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-amber-900 mb-12">
            Fonctionnalités principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-amber-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg text-amber-900">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-amber-700">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/e2c6ea7a-dc40-403f-ac09-bf6db57ad4e7.png" 
              alt="Knowledge Share Platform" 
              className="h-8 w-8 rounded"
            />
            <h4 className="text-xl font-bold">Knowledge Share Platform</h4>
          </div>
          <p className="text-amber-200 mb-6">
            Plateforme pédagogique pour l'accompagnement de projets étudiants
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-amber-200">
            <a href="#" className="hover:text-white transition-colors">À propos</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
