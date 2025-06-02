
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
        href: user.role === 'ADMIN' ? '/admin' : (user.role === 'AGENT' ? '/agent' : '/'), 
        icon: LayoutDashboard,
        badge: null
      }
    ];

    if (user.role === 'ADMIN') {
      return [
        ...baseItems,
        { name: 'Leads', href: '/leads', icon: Users, badge: '24' },
        { name: 'Call Center', href: '/callcenter', icon: Phone, badge: '12' },
        { name: 'Campañas', href: '/campaigns', icon: Target, badge: null },
        { name: 'Reportes', href: '/reports', icon: BarChart3, badge: null },
        { name: 'Calidad', href: '/quality', icon: Headphones, badge: '3' },
        { name: 'Comunicación', href: '/communication', icon: MessageSquare, badge: '8' }
      ];
    } else if (user.role === 'SUPERVISOR') {
      return [
        ...baseItems,
        { name: 'Leads Equipo', href: '/leads', icon: Users, badge: '24' },
        { name: 'Call Center', href: '/callcenter', icon: Phone, badge: '12' },
        { name: 'Calidad', href: '/quality', icon: Headphones, badge: '3' },
        { name: 'Reportes', href: '/reports', icon: BarChart3, badge: null }
      ];
    } else {
      return [
        ...baseItems,
        { name: 'Mis Leads', href: '/leads', icon: Users, badge: '8' },
        { name: 'Call Center', href: '/callcenter', icon: Phone, badge: '3' },
        { name: 'Mi Rendimiento', href: '/advisor-performance', icon: TrendingUp, badge: null }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  const isActive = (href: string) => {
    if (href === '/' || href === '/admin' || href === '/agent') {
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
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo y marca */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CCD</span>
              </div>
              <span className="font-bold text-xl text-gray-900">CRM Capacitación</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`relative ${isActive(item.href) ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {item.badge && (
                      <Badge 
                        variant="destructive" 
                        className="ml-2 px-1.5 py-0.5 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs"
              >
                3
              </Badge>
            </Button>
            
            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            
            {/* User menu */}
            <div className="flex items-center space-x-2">
              <Badge className={getRoleBadge()}>
                {user?.role}
              </Badge>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                {user?.name}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white border-b border-gray-200">
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
    </>
  );
};

export default Navigation;
