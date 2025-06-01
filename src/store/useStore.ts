
import { create } from 'zustand';

export interface Student {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  status: 'active' | 'inactive';
  isActive?: boolean;
  pathway?: 'pre-incubation' | 'incubation';
  groupId?: number;
  progress?: number;
  lastActive?: string;
}

export interface Coach {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  status: 'active' | 'inactive';
  isActive?: boolean;
  specialties?: string[];
}

export interface Group {
  id: number;
  name: string;
  pathway: 'pre-incubation' | 'incubation';
  coachId: number | null;
  studentIds: number[];
  createdAt: string;
}

export interface Deadline {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  courseId?: number;
  groupIds?: number[];
  type?: 'individual' | 'group';
  targetIds?: number[];
  status?: 'pending' | 'completed' | 'overdue';
  createdAt?: string;
}

export interface CoachingRequest {
  id: number;
  groupId: number;
  courseId: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDescription: string;
  coachId?: number; // ID du coach assigné (si approuvé)
  adminNotes?: string;
  assignedDate?: string; // Date d'assignation du coach
}

export interface Notification {
  id: number;
  userId: number;   // ID du destinataire (coach ou étudiant)
  title: string;    // Titre de la notification
  message: string;  // Contenu de la notification
  createdAt: string; // Date de création
  isRead: boolean;   // Si la notification a été lue
  type: 'coach_assigned' | 'request_approved' | 'request_rejected' | 'new_comment' | 'general';
}

interface StoreState {
  students: Student[];
  coaches: Coach[];
  groups: Group[];
  courses: any[];
  conversations: any[];
  messages: any[];
  assignments: any[];
  deadlines: Deadline[];
  coachingRequests: CoachingRequest[];
  notifications: Notification[];
  
  // CoachingRequest actions
  addCoachingRequest: (request: CoachingRequest) => void;
  updateCoachingRequest: (id: number, updates: Partial<CoachingRequest>) => void;
  deleteCoachingRequest: (id: number) => void;
  assignCoachToRequest: (requestId: number, coachId: number) => void;
  rejectCoachingRequest: (requestId: number, notes: string) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationAsRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  getNotificationsForUser: (userId: number) => Notification[];
  
  // Student actions
  addStudent: (student: Student) => void;
  updateStudent: (id: number, updates: Partial<Student>) => void;
  deleteStudent: (id: number) => void;
  
  // Coach actions  
  addCoach: (coach: Coach) => void;
  updateCoach: (id: number, updates: Partial<Coach>) => void;
  deleteCoach: (id: number) => void;
  
  // Group actions
  addGroup: (group: Group) => void;
  updateGroup: (id: number, updates: Partial<Group>) => void;
  deleteGroup: (id: number) => void;
  
  // Deadline actions
  addDeadline: (deadline: Deadline) => void;
  updateDeadline: (id: number, updates: Partial<Deadline>) => void;
  deleteDeadline: (id: number) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  students: [
    { 
      id: 1, 
      name: "Alice Martin", 
      firstName: "Alice", 
      lastName: "Martin", 
      email: "alice.martin@ksp.edu", 
      status: "active", 
      isActive: true,
      pathway: "pre-incubation", 
      password: "temp123",
      progress: 78,
      lastActive: "2025-05-30T14:30:00"
    },
    { 
      id: 2, 
      name: "Bob Durand", 
      firstName: "Bob", 
      lastName: "Durand", 
      email: "bob.durand@ksp.edu", 
      status: "active", 
      isActive: true,
      pathway: "incubation", 
      password: "temp123",
      progress: 45,
      lastActive: "2025-05-31T09:15:00"
    },
    { 
      id: 3, 
      name: "Claire Dubois", 
      firstName: "Claire", 
      lastName: "Dubois", 
      email: "claire.dubois@ksp.edu", 
      status: "active", 
      isActive: false,
      pathway: "pre-incubation", 
      password: "temp123",
      progress: 32,
      lastActive: "2025-05-29T16:45:00"
    }
  ],
  
  coaches: [
    { 
      id: 1, 
      name: "Prof. Martin Durand", 
      firstName: "Martin", 
      lastName: "Durand", 
      email: "martin.durand@ksp.edu", 
      status: "active", 
      isActive: true,
      specialties: ["Entrepreneuriat", "Innovation"], 
      password: "coach123" 
    },
    { 
      id: 2, 
      name: "Dr. Sarah Lefebvre", 
      firstName: "Sarah", 
      lastName: "Lefebvre", 
      email: "sarah.lefebvre@ksp.edu", 
      status: "active", 
      isActive: true,
      specialties: ["Marketing", "Business Model"], 
      password: "coach123" 
    }
  ],
  
  groups: [
    { 
      id: 1, 
      name: "Groupe Alpha - Promo 2024", 
      pathway: "pre-incubation", 
      coachId: 1, 
      studentIds: [1, 3], 
      createdAt: "2024-01-15" 
    }
  ],
  
  courses: [
    {
      id: 1,
      title: "Business Model Canvas",
      description: "Apprenez u00e0 construire votre Business Model Canvas",
      progress: 75,
      modules: 5
    },
    {
      id: 2,
      title: "u00c9tude de Marchu00e9",
      description: "Mu00e9thodes d'analyse de marchu00e9 pour startups",
      progress: 60,
      modules: 4
    },
    {
      id: 3,
      title: "Stratu00e9gie Marketing",
      description: "Du00e9veloppez votre stratu00e9gie marketing digital",
      progress: 40,
      modules: 6
    }
  ],
  
  deadlines: [
    {
      id: 1,
      title: "Remise du Business Model Canvas",
      description: "Première version du BMC à soumettre",
      dueDate: "2025-06-05T23:59:59",
      courseId: 1,
      groupIds: [1, 2]
    },
    {
      id: 2,
      title: "Présentation de mi-parcours",
      description: "Présentation orale de l'avancement du projet",
      dueDate: "2025-06-15T14:00:00",
      courseId: 1,
      groupIds: [1, 2, 3]
    },
    {
      id: 3,
      title: "Rendu du prototype",
      description: "Première version du prototype fonctionnel",
      dueDate: "2025-06-25T23:59:59",
      courseId: 2,
      groupIds: [3]
    },
    {
      id: 4,
      title: "Étude de marché",
      description: "Analyse des concurrents et du marché cible",
      dueDate: "2025-06-10T23:59:59",
      courseId: 3,
      groupIds: [1]
    },
    {
      id: 5,
      title: "Pitch final",
      description: "Présentation finale du projet devant jury",
      dueDate: "2025-07-15T10:00:00",
      courseId: 1,
      groupIds: [1, 2, 3]
    }
  ],
  
  conversations: [
    { 
      id: 1, 
      participants: [1, 101], 
      title: "Question sur le Business Model Canvas", 
      lastUpdated: "2025-05-28T14:30:00" 
    },
    { 
      id: 2, 
      participants: [2, 102], 
      title: "Problème avec le prototype", 
      lastUpdated: "2025-05-29T09:15:00" 
    },
    { 
      id: 3, 
      participants: [3, 103], 
      title: "Feedback sur présentation", 
      lastUpdated: "2025-05-30T16:45:00" 
    }
  ],

  messages: [
    { 
      id: 1, 
      conversationId: 1, 
      senderId: 1, 
      content: "Bonjour, j'ai une question concernant la section value proposition du BMC.", 
      timestamp: "2025-05-28T14:30:00",
      read: true
    },
    { 
      id: 2, 
      conversationId: 1, 
      senderId: 101, 
      content: "Bien sûr, en quoi puis-je vous aider avec cette section ?", 
      timestamp: "2025-05-28T14:35:00",
      read: true
    },
    { 
      id: 3, 
      conversationId: 2, 
      senderId: 2, 
      content: "Nous rencontrons un problème avec le prototype. Le login ne fonctionne pas correctement.", 
      timestamp: "2025-05-29T09:15:00",
      read: false
    }
  ],

  assignments: [
    { 
      id: 1, 
      title: "Business Model Canvas - Phase 1", 
      description: "Première version du Business Model Canvas", 
      courseId: 1, 
      dueDate: "2025-06-05T23:59:59", 
      groupIds: [1, 2],
      submissionStatus: {
        1: "submitted",
        2: "pending"
      }
    },
    { 
      id: 2, 
      title: "Prototype Web - Itération 1", 
      description: "Développement du premier prototype fonctionnel", 
      courseId: 2, 
      dueDate: "2025-06-15T23:59:59", 
      groupIds: [3],
      submissionStatus: {
        3: "pending"
      }
    },
    { 
      id: 3, 
      title: "Analyse de la concurrence", 
      description: "Rapport d'étude des solutions concurrentes", 
      courseId: 3, 
      dueDate: "2025-06-10T23:59:59", 
      groupIds: [1],
      submissionStatus: {
        1: "graded"
      }
    }
  ],
  
  coachingRequests: [
    {
      id: 1,
      groupId: 4,
      courseId: 1,
      requestDate: "2025-05-25T10:30:00",
      status: "pending",
      requestDescription: "Besoin d'un coach spécialisé en entrepreneuriat pour accompagner notre projet de startup EdTech."
    },
    {
      id: 2,
      groupId: 5,
      courseId: 2,
      requestDate: "2025-05-26T14:15:00",
      status: "approved",
      requestDescription: "Demande d'accompagnement pour le développement d'une application mobile de santé.",
      coachId: 2,
      adminNotes: "Coach avec expérience en santé digitale",
      assignedDate: "2025-05-28T09:45:00"
    },
    {
      id: 3,
      groupId: 6,
      courseId: 3,
      requestDate: "2025-05-29T11:20:00",
      status: "rejected",
      requestDescription: "Recherche d'un mentor pour notre projet d'intelligence artificielle.",
      adminNotes: "Pas de coach disponible avec cette spécialité actuellement. À reconsidérer en juillet."
    },
    {
      id: 4,
      groupId: 7,
      courseId: 1,
      requestDate: "2025-05-30T16:45:00",
      status: "pending",
      requestDescription: "Notre groupe a besoin d'un accompagnement pour valider notre business model et notre stratégie de financement."
    }
  ],

  notifications: [
    {
      id: 1,
      userId: 1, // Pour un coach
      title: "Nouvelle assignation de groupe",
      message: "Vous avez été assigné comme coach au Groupe StartupTech.",
      createdAt: "2025-05-28T09:45:00",
      isRead: false,
      type: "coach_assigned"
    },
    {
      id: 2,
      userId: 101, // Pour un étudiant dans le groupe
      title: "Demande de coaching approuvée",
      message: "Votre demande de coaching a été approuvée. Mme. Sophie Dubois sera votre coach.",
      createdAt: "2025-05-28T09:50:00",
      isRead: true,
      type: "request_approved"
    },
    {
      id: 3,
      userId: 2, // Pour un coach
      title: "Nouveau commentaire",
      message: "Un étudiant a laissé un commentaire sur son travail.",
      createdAt: "2025-05-29T14:20:00",
      isRead: false,
      type: "new_comment"
    }
  ],
  
  // Student actions
  addStudent: (student) => set((state) => ({
    students: [...state.students, student]
  })),
  
  updateStudent: (id, updates) => set((state) => ({
    students: state.students.map(student => 
      student.id === id ? { ...student, ...updates } : student
    )
  })),
  
  deleteStudent: (id) => set((state) => ({
    students: state.students.filter(student => student.id !== id),
    groups: state.groups.map(group => ({
      ...group,
      studentIds: group.studentIds.filter(studentId => studentId !== id)
    }))
  })),

  // Coach actions
  addCoach: (coach) => set((state) => ({
    coaches: [...state.coaches, coach]
  })),
  
  updateCoach: (id, updates) => set((state) => ({
    coaches: state.coaches.map(coach => 
      coach.id === id ? { ...coach, ...updates } : coach
    )
  })),
  
  deleteCoach: (id) => set((state) => ({
    coaches: state.coaches.filter(coach => coach.id !== id)
  })),

  // Group actions
  addGroup: (group) => set((state) => {
    // Mettre à jour les étudiants avec le groupId
    const updatedStudents = state.students.map(student => 
      group.studentIds.includes(student.id) 
        ? { ...student, groupId: group.id }
        : student
    );
    
    return {
      groups: [...state.groups, group],
      students: updatedStudents
    };
  }),
  
  updateGroup: (id, updates) => set((state) => {
    const oldGroup = state.groups.find(g => g.id === id);
    const newGroup = { ...oldGroup, ...updates };
    
    // Mettre à jour les étudiants
    let updatedStudents = state.students.map(student => {
      // Retirer l'ancien groupId si l'étudiant n'est plus dans le groupe
      if (oldGroup?.studentIds.includes(student.id) && !newGroup.studentIds.includes(student.id)) {
        return { ...student, groupId: undefined };
      }
      // Ajouter le nouveau groupId si l'étudiant est maintenant dans le groupe
      if (!oldGroup?.studentIds.includes(student.id) && newGroup.studentIds.includes(student.id)) {
        return { ...student, groupId: id };
      }
      return student;
    });
    
    return {
      groups: state.groups.map(group => 
        group.id === id ? newGroup : group
      ),
      students: updatedStudents
    };
  }),
  
  deleteGroup: (id) => set((state) => ({
    groups: state.groups.filter(group => group.id !== id),
    students: state.students.map(student => 
      student.groupId === id ? { ...student, groupId: undefined } : student
    )
  })),
  
  // Deadline actions
  addDeadline: (deadline) => set((state) => ({
    deadlines: [...state.deadlines, deadline]
  })),
  
  updateDeadline: (id, updates) => set((state) => ({
    deadlines: state.deadlines.map(deadline => 
      deadline.id === id ? { ...deadline, ...updates } : deadline
    )
  })),
  
  deleteDeadline: (id) => set((state) => ({
    deadlines: state.deadlines.filter(deadline => deadline.id !== id)
  })),
  
  // CoachingRequest actions
  addCoachingRequest: (request) => set((state) => ({
    coachingRequests: [...state.coachingRequests, request]
  })),
  
  updateCoachingRequest: (id, updates) => set((state) => ({
    coachingRequests: state.coachingRequests.map(request => 
      request.id === id ? { ...request, ...updates } : request
    )
  })),
  
  deleteCoachingRequest: (id) => set((state) => ({
    coachingRequests: state.coachingRequests.filter(request => request.id !== id)
  })),
  
  // Méthodes spécifiques pour la gestion des demandes de coaching
  assignCoachToRequest: (requestId, coachId) => set((state) => {
    // Récupérer la demande et le groupe associé
    const request = state.coachingRequests.find(r => r.id === requestId);
    const group = request ? state.groups.find(g => g.id === request.groupId) : null;
    const coach = state.coaches.find(c => c.id === coachId);
    const coachName = coach ? `${coach.firstName || ''} ${coach.lastName || ''}`.trim() : 'Un coach';
    
    // Créer les notifications
    const currentDate = new Date().toISOString();
    let nextNotificationId = Math.max(0, ...state.notifications.map(n => n.id)) + 1;
    const notifications = [...state.notifications];
    
    // Notification pour le coach
    notifications.push({
      id: nextNotificationId++,
      userId: coachId,
      title: 'Nouvelle assignation de groupe',
      message: `Vous avez été assigné comme coach au Groupe ${group?.name || 'inconnu'}.`,
      createdAt: currentDate,
      isRead: false,
      type: 'coach_assigned'
    });
    
    // Notifications pour les étudiants du groupe
    if (group) {
      group.studentIds.forEach(studentId => {
        notifications.push({
          id: nextNotificationId++,
          userId: studentId,
          title: 'Demande de coaching approuvée',
          message: `Votre demande de coaching a été approuvée. ${coachName} sera votre coach.`,
          createdAt: currentDate,
          isRead: false,
          type: 'request_approved'
        });
      });
    }
    
    return {
      coachingRequests: state.coachingRequests.map(r =>
        r.id === requestId ? { 
          ...r, 
          coachId, 
          status: 'approved' as const, 
          assignedDate: currentDate 
        } : r
      ),
      notifications
    };
  }),
  
  rejectCoachingRequest: (requestId, notes) => set((state) => {
    // Récupérer la demande et le groupe associé
    const request = state.coachingRequests.find(r => r.id === requestId);
    const group = request ? state.groups.find(g => g.id === request.groupId) : null;
    
    // Créer les notifications pour les étudiants du groupe
    const currentDate = new Date().toISOString();
    let nextNotificationId = Math.max(0, ...state.notifications.map(n => n.id)) + 1;
    const notifications = [...state.notifications];
    
    if (group) {
      group.studentIds.forEach(studentId => {
        notifications.push({
          id: nextNotificationId++,
          userId: studentId,
          title: 'Demande de coaching rejetée',
          message: `Votre demande de coaching a été rejetée. Motif: ${notes || 'Aucun motif fourni'}`,
          createdAt: currentDate,
          isRead: false,
          type: 'request_rejected'
        });
      });
    }
    
    return {
      coachingRequests: state.coachingRequests.map(r =>
        r.id === requestId ? { 
          ...r, 
          status: 'rejected' as const,
          adminNotes: notes
        } : r
      ),
      notifications
    };
  }),
  
  // Méthodes de gestion des notifications
  addNotification: (notification) => set((state) => {
    const nextId = Math.max(0, ...state.notifications.map(n => n.id)) + 1;
    return {
      notifications: [...state.notifications, {
        ...notification,
        id: nextId,
        createdAt: new Date().toISOString(),
        isRead: false
      }]
    };
  }),
  
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    )
  })),
  
  deleteNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(notif => notif.id !== id)
  })),
  
  getNotificationsForUser: (userId) => {
    const state = get();
    return state.notifications.filter(notif => notif.userId === userId);
  }
}));
