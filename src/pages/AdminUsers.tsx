
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Shield,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Download,
  Upload,
  Filter,
  MoreVertical
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface User {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone: string;
  extension: string;
  user_group: string;
  active: boolean;
  vicidial_active: boolean;
  last_login: string;
  created_at: string;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    role: 'AGENT',
    phone: '',
    extension: '',
    user_group: 'DEFAULT',
    active: true,
    vicidial_active: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por rol
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtro por estado
    if (statusFilter === 'ACTIVE') {
      filtered = filtered.filter(user => user.active);
    } else if (statusFilter === 'INACTIVE') {
      filtered = filtered.filter(user => !user.active);
    }

    setFilteredUsers(filtered);
  };

  const createUser = async () => {
    try {
      // Generar user_id automáticamente si no se proporciona
      if (!newUser.user_id) {
        const timestamp = Date.now().toString().slice(-6);
        newUser.user_id = `${newUser.first_name.toLowerCase()}${timestamp}`;
      }

      const { error } = await supabase
        .from('users')
        .insert([newUser]);

      if (error) throw error;

      toast({
        title: "Usuario creado",
        description: `Usuario ${newUser.first_name} ${newUser.last_name} creado exitosamente`,
      });

      setNewUser({
        user_id: '',
        first_name: '',
        last_name: '',
        email: '',
        role: 'AGENT',
        phone: '',
        extension: '',
        user_group: 'DEFAULT',
        active: true,
        vicidial_active: false
      });
      setIsCreateModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Error al crear el usuario",
        variant: "destructive",
      });
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(selectedUser)
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "Usuario actualizado",
        description: `Usuario ${selectedUser.first_name} ${selectedUser.last_name} actualizado exitosamente`,
      });

      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el usuario",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: number, userName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${userName}?`)) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Usuario eliminado",
        description: `Usuario ${userName} eliminado exitosamente`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (user: User, field: 'active' | 'vicidial_active') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ [field]: !user[field] })
        .eq('id', user.id);

      if (error) throw error;

      const statusName = field === 'active' ? 'estado general' : 'estado Vicidial';
      toast({
        title: "Estado actualizado",
        description: `${statusName} de ${user.first_name} actualizado exitosamente`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el estado del usuario",
        variant: "destructive",
      });
    }
  };

  const exportUsers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Nombre,Apellido,Email,Rol,Teléfono,Extensión,Grupo,Activo,Vicidial Activo,Último Login,Fecha Creación\n"
      + filteredUsers.map(user => 
          `${user.user_id},"${user.first_name}","${user.last_name}","${user.email}",${user.role},"${user.phone}","${user.extension}","${user.user_group}",${user.active},${user.vicidial_active},"${user.last_login}","${user.created_at}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportación completada",
      description: `Se exportaron ${filteredUsers.length} usuarios`,
    });
  };

  const bulkActions = async (action: string, selectedUserIds: number[]) => {
    if (selectedUserIds.length === 0) {
      toast({
        title: "Error",
        description: "No hay usuarios seleccionados",
        variant: "destructive",
      });
      return;
    }

    try {
      let updateData: any = {};
      
      switch (action) {
        case 'activate':
          updateData = { active: true };
          break;
        case 'deactivate':
          updateData = { active: false };
          break;
        case 'enable_vicidial':
          updateData = { vicidial_active: true };
          break;
        case 'disable_vicidial':
          updateData = { vicidial_active: false };
          break;
        default:
          return;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .in('id', selectedUserIds);

      if (error) throw error;

      toast({
        title: "Acción completada",
        description: `Se actualizaron ${selectedUserIds.length} usuarios`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error in bulk action:', error);
      toast({
        title: "Error",
        description: "Error al realizar la acción masiva",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-500';
      case 'SUPERVISOR': return 'bg-blue-500';
      case 'AGENT': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra asesores, supervisores y permisos</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportUsers} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setIsImportModalOpen(true)} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={newUser.first_name}
                      onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                      placeholder="Nombre"
                    />
                  </div>
                  <div>
                    <Label>Apellido</Label>
                    <Input
                      value={newUser.last_name}
                      onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                      placeholder="Apellido"
                    />
                  </div>
                </div>
                <div>
                  <Label>ID de Usuario (Opcional)</Label>
                  <Input
                    value={newUser.user_id}
                    onChange={(e) => setNewUser({...newUser, user_id: e.target.value})}
                    placeholder="Se generará automáticamente si se deja vacío"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      placeholder="Teléfono"
                    />
                  </div>
                  <div>
                    <Label>Extensión</Label>
                    <Input
                      value={newUser.extension}
                      onChange={(e) => setNewUser({...newUser, extension: e.target.value})}
                      placeholder="Ext."
                    />
                  </div>
                </div>
                <div>
                  <Label>Rol</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AGENT">Agente</SelectItem>
                      <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Grupo</Label>
                  <Input
                    value={newUser.user_group}
                    onChange={(e) => setNewUser({...newUser, user_group: e.target.value})}
                    placeholder="Grupo de usuario"
                  />
                </div>
                <Button onClick={createUser} className="w-full">
                  Crear Usuario
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros y búsqueda mejorados */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar usuarios por nombre, email o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                  <SelectItem value="AGENT">Agente</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="ACTIVE">Activos</SelectItem>
                  <SelectItem value="INACTIVE">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline">
              {filteredUsers.length} usuarios
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios mejorada */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user.first_name} {user.last_name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {user.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {user.phone} {user.extension && `Ext. ${user.extension}`}
                      </span>
                      <span>ID: {user.user_id}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant="outline">
                        {user.user_group}
                      </Badge>
                      {user.last_login && (
                        <span className="text-xs text-gray-500">
                          Último login: {new Date(user.last_login).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={user.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleUserStatus(user, 'active')}
                    title={user.active ? "Usuario activo" : "Usuario inactivo"}
                  >
                    {user.active ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={user.vicidial_active ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleUserStatus(user, 'vicidial_active')}
                    title={user.vicidial_active ? "Vicidial activo" : "Vicidial inactivo"}
                  >
                    <Shield className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        setSelectedUser(user);
                        setIsEditModalOpen(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleUserStatus(user, 'active')}>
                        {user.active ? <UserX className="h-4 w-4 mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
                        {user.active ? 'Desactivar' : 'Activar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleUserStatus(user, 'vicidial_active')}>
                        <Shield className="h-4 w-4 mr-2" />
                        {user.vicidial_active ? 'Desactivar Vicidial' : 'Activar Vicidial'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteUser(user.id, `${user.first_name} ${user.last_name}`)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL' 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primer usuario'
                }
              </p>
              {!searchTerm && roleFilter === 'ALL' && statusFilter === 'ALL' && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Usuario
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={selectedUser.first_name}
                    onChange={(e) => setSelectedUser({...selectedUser, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Apellido</Label>
                  <Input
                    value={selectedUser.last_name}
                    onChange={(e) => setSelectedUser({...selectedUser, last_name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    value={selectedUser.phone}
                    onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Extensión</Label>
                  <Input
                    value={selectedUser.extension}
                    onChange={(e) => setSelectedUser({...selectedUser, extension: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Rol</Label>
                <Select value={selectedUser.role} onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AGENT">Agente</SelectItem>
                    <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Grupo</Label>
                <Input
                  value={selectedUser.user_group}
                  onChange={(e) => setSelectedUser({...selectedUser, user_group: e.target.value})}
                />
              </div>
              <Button onClick={updateUser} className="w-full">
                Actualizar Usuario
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de importación */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Usuarios</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Sube un archivo CSV con la siguiente estructura: ID, Nombre, Apellido, Email, Rol, Teléfono, Extensión, Grupo
            </p>
            <Input type="file" accept=".csv" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
                Cancelar
              </Button>
              <Button>
                Importar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
