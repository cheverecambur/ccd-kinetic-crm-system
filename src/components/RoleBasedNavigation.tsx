
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
  UserCheck
} from 'lucide-react';

const RoleBasedNavigation = () => {
  const { user, hasPermission } = useAuth();

  if (!user) return null;

  const getNavigationItems = () => {
    const baseItems = [
      { 
        name: 'Dashboard', 
        href: user.role === 'ADMIN' ? '/admin' : user.role === 'AGENT' ? '/advisor-dashboard' : '/', 
        icon: LayoutDashboard,
        badge: null
      }
    ];

    if (user.role === 'ADMIN') {
      return [
        ...baseItems,
        { name: 'Gestión Usuarios', href: '/admin/users', icon: Users, badge: null },
        { name: 'Leads', href: '/leads', icon: Users, badge: '24' },
        { name: 'Call Center', href: '/call-center', icon: Phone, badge: '12' },
        { name: 'Campañas', href: '/campaigns', icon: Target, badge: null },
        { name: 'Reportes', href: '/reports', icon: BarChart3, badge: null },
        { name: 'Calidad', href: '/quality', icon: Headphones, badge: '3' },
        { name: 'Comunicación', href: '/communication', icon: MessageSquare, badge: '8' }
      ];
    } else if (user.role === 'SUPERVISOR') {
      return [
        ...baseItems,
        { name: 'Leads Equipo', href: '/leads', icon: Users, badge: '24' },
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
    } else {
      return [
        ...baseItems,
        { name: 'Mis Leads', href: '/leads', icon: Users, badge: '8' },
        { name: 'Call Center', href: '/call-center', icon: Phone, badge: '3' },
        { name: 'Mi Rendimiento', href: '/advisor-performance', icon: TrendingUp, badge: null }
      ];
    }
  };

  return getNavigationItems();
};

export default RoleBasedNavigation;
