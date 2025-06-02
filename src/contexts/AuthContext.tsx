
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'AGENT';
  user_id: string;
  extension?: string;
  user_group?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulamos usuarios para el demo
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Admin Principal',
      email: 'admin@empresa.com',
      role: 'ADMIN',
      user_id: 'admin001'
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos@empresa.com',
      role: 'AGENT',
      user_id: 'agent001',
      extension: '101',
      user_group: 'VENTAS'
    },
    {
      id: '3',
      name: 'María Supervisor',
      email: 'maria@empresa.com',
      role: 'SUPERVISOR',
      user_id: 'super001'
    }
  ];

  useEffect(() => {
    // Simular verificación de sesión existente
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular autenticación
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const permissions = {
      'ADMIN': [
        'view_all_leads',
        'manage_users',
        'view_reports',
        'manage_campaigns',
        'quality_monitoring',
        'system_settings',
        'performance_analytics',
        'roi_analysis'
      ],
      'SUPERVISOR': [
        'view_team_leads',
        'quality_monitoring',
        'view_reports',
        'manage_team_campaigns',
        'performance_analytics'
      ],
      'AGENT': [
        'view_own_leads',
        'make_calls',
        'update_lead_status',
        'view_own_performance'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
