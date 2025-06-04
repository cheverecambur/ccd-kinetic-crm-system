
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard,
  Users,
  Phone,
  Target,
  BarChart3,
  MessageSquare,
  Headphones,
  TrendingUp,
  Settings
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge: string | null;
}

const RoleBasedNavigation = (): NavigationItem[] => {
  const { user } = useAuth();

  if (!user) return [];

  const getNavigationItems = (): NavigationItem[] => {
    if (user.role === 'ADMIN') {
      return [
        { name: 'Dashboard Admin', href: '/admin', icon: LayoutDashboard, badge: null },
        { name: 'Gestión de Leads', href: '/leads', icon: Users, badge: '24' },
        { name: 'Call Center', href: '/call-center', icon: Phone, badge: '12' },
        { name: 'Campañas', href: '/campaigns', icon: Target, badge: null },
        { name: 'Reportes', href: '/reports', icon: BarChart3, badge: null },
        { name: 'Calidad', href: '/quality', icon: Headphones, badge: '3' },
        { name: 'Comunicación', href: '/communication', icon: MessageSquare, badge: '8' },
        { name: 'Configuración', href: '/admin/settings', icon: Settings, badge: null }
      ];
    } else if (user.role === 'SUPERVISOR') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null },
        { name: 'Leads del Equipo', href: '/leads', icon: Users, badge: '24' },
        { name: 'Call Center', href: '/call-center', icon: Phone, badge: '12' },
        { name: 'Calidad', href: '/quality', icon: Headphones, badge: '3' },
        { name: 'Reportes', href: '/reports', icon: BarChart3, badge: null }
      ];
    } else if (user.role === 'AGENT') {
      return [
        { name: 'Mi Dashboard', href: '/advisor-dashboard', icon: LayoutDashboard, badge: null },
        { name: 'Mis Leads', href: '/leads', icon: Users, badge: '8' },
        { name: 'Call Center', href: '/call-center', icon: Phone, badge: '3' },
        { name: 'Mi Rendimiento', href: '/advisor-performance', icon: TrendingUp, badge: null }
      ];
    }

    // Default navigation for other roles
    return [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard, badge: null },
      { name: 'Leads', href: '/leads', icon: Users, badge: '8' },
      { name: 'Call Center', href: '/call-center', icon: Phone, badge: '3' }
    ];
  };

  return getNavigationItems();
};

export default RoleBasedNavigation;
