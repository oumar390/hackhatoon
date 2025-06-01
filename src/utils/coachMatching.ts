/**
 * Utilitaire pour la suggestion automatique de coachs en fonction de la description
 * de la demande et des spu00e9cialitu00e9s des coachs disponibles.
 */

import { Coach } from '../store/useStore';

// Liste des mots-clu00e9s liu00e9s aux domaines d'expertise
const EXPERTISE_KEYWORDS: Record<string, string[]> = {
  'du00e9veloppement web': ['web', 'site', 'frontend', 'backend', 'du00e9veloppement web', 'html', 'css', 'javascript', 'react', 'angular', 'vue', 'node'],
  'mobile': ['mobile', 'android', 'ios', 'flutter', 'react native', 'application mobile'],
  'marketing': ['marketing', 'seo', 'sem', 'ru00e9seaux sociaux', 'acquisition', 'growth', 'promotion', 'publicitu00e9'],
  'design': ['design', 'ui', 'ux', 'expu00e9rience utilisateur', 'interface', 'maquette', 'prototype'],
  'business model': ['business model', 'modu00e8le u00e9conomique', 'revenus', 'monu00e9tisation', 'pricing', 'canvas'],
  'financement': ['financement', 'investissement', 'levu00e9e de fonds', 'seed', 'venture', 'business angel'],
  'intelligence artificielle': ['intelligence artificielle', 'ia', 'ai', 'machine learning', 'ml', 'deep learning', 'nlp'],
  'santu00e9': ['santu00e9', 'mu00e9dical', 'e-santu00e9', 'health', 'healthcare', 'mu00e9decine'],
  'u00e9ducation': ['u00e9ducation', 'edtech', 'formation', 'apprentissage', 'e-learning', 'enseignement'],
  'blockchain': ['blockchain', 'crypto', 'nft', 'web3', 'smart contract', 'ethereum', 'bitcoin'],
  'innovation': ['innovation', 'r&d', 'recherche et du00e9veloppement', 'brevetage', 'propriu00e9tu00e9 intellectuelle'],
  'durabilitu00e9': ['durabilitu00e9', 'du00e9veloppement durable', 'u00e9cologie', 'green', 'environnement', 'impact', 'esg']
};

/**
 * Calcule un score de correspondance entre la description d'une demande et un coach
 * en fonction de ses spu00e9cialitu00e9s.
 * 
 * @param requestDescription - Description de la demande de coaching
 * @param coach - Objet Coach avec ses spu00e9cialitu00e9s
 * @returns Score de correspondance (plus le score est u00e9levu00e9, meilleure est la correspondance)
 */
export const calculateMatchScore = (requestDescription: string, coach: Coach): number => {
  if (!requestDescription || !coach.specialties || coach.specialties.length === 0) {
    return 0;
  }

  const descriptionLower = requestDescription.toLowerCase();
  let totalScore = 0;

  // Parcourir les spu00e9cialitu00e9s du coach
  coach.specialties.forEach(specialty => {
    // Si la spu00e9cialitu00e9 est directement mentionnu00e9e dans la description
    if (descriptionLower.includes(specialty.toLowerCase())) {
      totalScore += 10; // Score u00e9levu00e9 pour une correspondance directe
    }

    // Vu00e9rifier les mots-clu00e9s associu00e9s u00e0 cette spu00e9cialitu00e9
    const specialtyKeywords = EXPERTISE_KEYWORDS[specialty.toLowerCase()] || [];
    specialtyKeywords.forEach(keyword => {
      if (descriptionLower.includes(keyword.toLowerCase())) {
        totalScore += 5; // Score modu00e9ru00e9 pour des mots-clu00e9s liu00e9s
      }
    });
  });

  // Vu00e9rifier tous les mots-clu00e9s connus pour des correspondances partielles
  Object.entries(EXPERTISE_KEYWORDS).forEach(([expertise, keywords]) => {
    if (!coach.specialties?.includes(expertise)) {
      keywords.forEach(keyword => {
        if (descriptionLower.includes(keyword.toLowerCase())) {
          totalScore += 2; // Score faible pour des mots-clu00e9s d'autres domaines
        }
      });
    }
  });

  return totalScore;
};

/**
 * Suggu00e8re des coachs pour une demande de coaching en fonction de la description
 * et retourne une liste triu00e9e par pertinence.
 * 
 * @param requestDescription - Description de la demande de coaching
 * @param coaches - Liste de tous les coachs disponibles
 * @param limit - Nombre maximum de suggestions u00e0 retourner (par du00e9faut 3)
 * @returns Liste des coachs suggu00e9ru00e9s, triu00e9s par score de correspondance
 */
export const suggestCoachesForRequest = (
  requestDescription: string,
  coaches: Coach[],
  limit = 3
): { coach: Coach; score: number }[] => {
  // Si pas de description ou pas de coachs, retourner un tableau vide
  if (!requestDescription || !coaches.length) {
    return [];
  }

  // Filtrer les coachs inactifs
  const activeCoaches = coaches.filter(coach => coach.status === 'active');
  
  if (!activeCoaches.length) {
    return [];
  }
  
  // Calculer les scores pour chaque coach
  const coachesWithScores = activeCoaches.map(coach => ({
    coach,
    score: calculateMatchScore(requestDescription, coach)
  }));

  // Trouver le score maximum pour normaliser
  const maxScore = Math.max(...coachesWithScores.map(c => c.score), 1); // Éviter division par zéro
  
  // Normaliser les scores en pourcentage (0-100) et trier
  const normalizedScores = coachesWithScores.map(c => ({
    coach: c.coach,
    score: Math.round((c.score / maxScore) * 100)
  }));

  // Trier par score décroissant et limiter le nombre de résultats
  // Ne retourner que les coachs avec un score minimal de 10%
  return normalizedScores
    .filter(c => c.score >= 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
