import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface SessionTimerProps {
  className?: string;
}

export function SessionTimer({ className = "" }: SessionTimerProps) {
  const [sessionTime, setSessionTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    // Récupérer le temps de connexion depuis le localStorage s'il existe
    let loginTime = localStorage.getItem('loginTime');
    let pausedTime = localStorage.getItem('pausedSessionTime');
    
    // Si aucun temps de connexion n'est stocké, l'enregistrer maintenant
    if (!loginTime) {
      loginTime = Date.now().toString();
      localStorage.setItem('loginTime', loginTime);
    }
    
    // Si un temps en pause existe, reprendre depuis ce point
    if (pausedTime) {
      setSessionTime(parseInt(pausedTime));
      localStorage.removeItem('pausedSessionTime');
    }
    
    // Fonction pour calculer et mettre à jour le temps écoulé
    const updateElapsedTime = () => {
      const storedLoginTime = localStorage.getItem('loginTime') || Date.now().toString();
      const elapsedSeconds = Math.floor((Date.now() - parseInt(storedLoginTime)) / 1000);
      setSessionTime(elapsedSeconds);
    };
    
    // Mettre à jour immédiatement puis toutes les secondes
    updateElapsedTime();
    const intervalId = setInterval(updateElapsedTime, 1000);
    
    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []);
  
  // Formater le temps en heures:minutes:secondes
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Gérer la mise en pause / reprise du timer
  const toggleTimer = () => {
    setIsActive(!isActive);
    
    if (isActive) {
      // Si on met en pause, on sauvegarde le temps actuel
      localStorage.setItem('pausedSessionTime', sessionTime.toString());
    } else {
      // Si on reprend, on enlève le temps de pause sauvegardé
      localStorage.removeItem('pausedSessionTime');
    }
  };
  
  // Gérer la réinitialisation du timer
  const resetTimer = () => {
    setSessionTime(0);
    localStorage.setItem('loginTime', Date.now().toString());
    localStorage.removeItem('pausedSessionTime');
    setIsActive(true);
  };
  
  return (
    <div className={`flex items-center gap-2 p-3 border-t border-amber-200 ${isActive ? 'bg-amber-50' : 'bg-amber-100/30'} text-xs ${className}`}>
      <button 
        onClick={toggleTimer}
        title={isActive ? 'Mettre en pause' : 'Reprendre'}
        className="hover:bg-amber-100 p-1 rounded"
      >
        <Clock className="h-4 w-4 text-amber-700" />
      </button>
      <span className={`${isActive ? 'text-slate-700' : 'text-slate-500'}`}>
        Session: {formatTime(sessionTime)}
      </span>
      <button
        onClick={resetTimer}
        title="Réinitialiser"
        className="hover:bg-amber-100 p-1 rounded ml-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </div>
  );
}
