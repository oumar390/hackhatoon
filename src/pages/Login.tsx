
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'authentification
    setTimeout(() => {
      if (email && password) {
        // Déterminer le rôle selon l'email pour la démo
        const role = email.includes("admin") ? "admin" : 
                    email.includes("coach") ? "coach" : "student";
        
        const user = {
          id: 1,
          email,
          role: role as "admin" | "coach" | "student",
          name: role === "admin" ? "Admin User" : 
                role === "coach" ? "Coach User" : "Student User"
        };

        login(user);

        toast.success("Connexion réussie !", {
          description: `Bienvenue, vous êtes connecté en tant que ${role}`,
        });
        
        navigate("/dashboard");
      } else {
        toast.error("Erreur de connexion", {
          description: "Veuillez vérifier vos identifiants",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-amber-200 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center">
              <div className="text-white font-bold text-xl">KSP</div>
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Connexion
            </CardTitle>
            <CardDescription className="text-slate-600">
              Accédez à votre espace Knowledge Share Platform
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-700" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-amber-200 focus:border-amber-600"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-700" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-amber-200 focus:border-amber-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-amber-700 hover:text-amber-800"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-amber-700 hover:bg-amber-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-slate-600">
            <p>Comptes de test :</p>
            <p className="text-xs mt-1">
              admin@test.com | coach@test.com | student@test.com
            </p>
            <p className="text-xs">Mot de passe : test123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
