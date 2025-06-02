
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminPanel from './AdminPanel';
import AgentDashboard from './AgentDashboard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <AdminPanel />;
  } else if (user?.role === 'AGENT') {
    return <AgentDashboard />;
  } else if (user?.role === 'SUPERVISOR') {
    // Dashboard específico para supervisores
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard del Supervisor</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Dashboard específico para supervisores en desarrollo...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard General</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Dashboard por defecto</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
