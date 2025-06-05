
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard,
  Users,
  Phone,
  Target,
  BarChart3,
  MessageSquare,
  Settings,
  Bell,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Headphones,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
      { 
        name: 'Dashboard', 
        href: user.role === 'ADMIN' ? '/admin' : (user.role === 'AGENT' ? '/advisor-dashboard' : '/'), 
        icon: LayoutDashboard,
        badge: null
      }
    ];

    if (user.role === 'ADMIN') {
      return [
        ...baseItems,
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
    } else {
      return [
        ...baseItems,
        { name: 'Mis Leads', href: '/leads', icon: Users, badge: '8' },
        { name: 'Call Center', href: '/call-center', icon: Phone, badge: '3' },
        { name: 'Mi Rendimiento', href: '/advisor-performance', icon: TrendingUp, badge: null }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  const isActive = (href: string) => {
    if (href === '/' || href === '/admin' || href === '/advisor-dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    const roleColors = {
      'ADMIN': 'bg-red-500',
      'SUPERVISOR': 'bg-blue-500',
      'AGENT': 'bg-green-500'
    };
    return roleColors[user?.role || 'AGENT'];
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex lg:flex-col bg-white border-r border-gray-200 w-64 min-h-screen">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">CCD</span>
          </div>
          <span className="font-bold text-xl text-gray-900">CRM</span>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.href}>
                  <div className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href) 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}>
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant="destructive" 
                        className="ml-auto text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User section */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <User className="h-8 w-8 text-gray-400 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <Badge className={`${getRoleBadge()} text-xs`}>
                {user?.role}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CCD</span>
              </div>
              <span className="font-bold text-lg text-gray-900">CRM</span>
              <Badge className={`${getRoleBadge()} text-xs`}>
                {user?.role}
              </Badge>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu items */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.name} 
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      isActive(item.href) 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {item.badge && (
                        <Badge 
                          variant="destructive" 
                          className="text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                );
              })}
              
              {/* Mobile user section */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{user?.name}</span>
                  </div>
                </div>
                <div className="flex space-x-1 px-3">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Bell className="h-4 w-4 mr-2" />
                    Notif.
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Config.
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Salir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile content padding */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default Navigation;
