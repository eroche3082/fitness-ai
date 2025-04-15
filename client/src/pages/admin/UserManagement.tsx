import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvatarSelector } from '@/components/ui/AvatarSelector';
import ReadyPlayerMeAvatar from '@/components/ui/ReadyPlayerMeAvatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  MoreHorizontal,
  Users,
  UserPlus,
  UserX,
  UserCheck,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';

// Tipos de usuario
type UserStatus = 'active' | 'inactive' | 'suspended';
type UserCategory = 'Basic' | 'Premium' | 'VIP' | 'Elite';

interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  dateCreated: string;
  category: UserCategory;
  lastLogin: string;
  accessCode?: string;
  avatarUrl?: string;
  avatarId?: string;
}

// Datos de muestra
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    status: 'active',
    dateCreated: '2024-12-01',
    category: 'Premium',
    lastLogin: '2025-04-14',
    accessCode: 'FIT-PRE-1234'
  },
  {
    id: '2',
    name: 'María López',
    email: 'maria@example.com',
    status: 'active',
    dateCreated: '2025-01-15',
    category: 'Basic',
    lastLogin: '2025-04-10',
    accessCode: 'FIT-BAS-5678'
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    status: 'inactive',
    dateCreated: '2025-02-20',
    category: 'VIP',
    lastLogin: '2025-03-22',
    accessCode: 'FIT-VIP-9012'
  },
  {
    id: '4',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    status: 'suspended',
    dateCreated: '2025-03-05',
    category: 'Elite',
    lastLogin: '2025-04-01',
    accessCode: 'FIT-ELI-3456'
  },
  {
    id: '5',
    name: 'Roberto Sánchez',
    email: 'roberto@example.com',
    status: 'active',
    dateCreated: '2025-01-30',
    category: 'Basic',
    lastLogin: '2025-04-13',
    accessCode: 'FIT-BAS-7890'
  }
];

export default function UserManagementPage() {
  const { userRole } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(sampleUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<UserCategory | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Función para registrar actividad administrativa
  const logAdminActivity = (activity: string) => {
    console.log(`[ADMIN LOG] ${new Date().toISOString()}: ${activity}`);
  };

  // Aplicar filtros
  useEffect(() => {
    let results = [...users];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        (user.accessCode && user.accessCode.toLowerCase().includes(term))
      );
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      results = results.filter(user => user.status === statusFilter);
    }
    
    // Filtrar por categoría
    if (categoryFilter !== 'all') {
      results = results.filter(user => user.category === categoryFilter);
    }
    
    setFilteredUsers(results);
  }, [users, searchTerm, statusFilter, categoryFilter]);

  // Verificar permisos
  useEffect(() => {
    if (userRole !== 'manager' && userRole !== 'admin') {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para acceder a esta página",
        variant: "destructive"
      });
      setLocation('/');
    }
  }, [userRole, setLocation, toast]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowDetails(true);
    logAdminActivity(`Viewed user details: ${user.name} (${user.id})`);
  };

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    
    const user = users.find(u => u.id === userId);
    if (user) {
      logAdminActivity(`Changed user status: ${user.name} (${user.id}) to ${newStatus}`);
      
      toast({
        title: "Estado actualizado",
        description: `El usuario ${user.name} ahora está ${newStatus === 'active' ? 'activo' : newStatus === 'inactive' ? 'inactivo' : 'suspendido'}.`,
        variant: "default"
      });
    }
  };

  const handleCategoryChange = (userId: string, newCategory: UserCategory) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, category: newCategory } : user
    );
    setUsers(updatedUsers);
    
    const user = users.find(u => u.id === userId);
    if (user) {
      logAdminActivity(`Changed user category: ${user.name} (${user.id}) to ${newCategory}`);
      
      toast({
        title: "Categoría actualizada",
        description: `El usuario ${user.name} ahora es ${newCategory}.`,
        variant: "default"
      });
    }
  };

  // Renderizar estado del usuario con color
  const renderStatus = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Activo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inactivo</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Suspendido</Badge>;
    }
  };

  // Renderizar categoría del usuario con color
  const renderCategory = (category: UserCategory) => {
    switch (category) {
      case 'Basic':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Básico</Badge>;
      case 'Premium':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Premium</Badge>;
      case 'VIP':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">VIP</Badge>;
      case 'Elite':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Elite</Badge>;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-green-500">Gestión de Usuarios</h1>
            <p className="text-gray-400 mt-1">
              Administra y supervisa los usuarios de la plataforma Fitness AI
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            {/* Las acciones de eliminar usuario están deshabilitadas para Admin Manager */}
            <Button 
              variant="outline" 
              className="ml-2 border-green-500 text-green-500 hover:bg-green-900"
              onClick={() => {
                toast({
                  title: "Función no disponible",
                  description: "La creación de usuarios no está implementada en este momento",
                  variant: "default"
                });
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo usuario
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Búsqueda */}
          <div>
            <Label htmlFor="search" className="text-gray-400">Buscar</Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre, email o código"
              className="bg-gray-900 border-gray-700 text-white focus:border-green-500"
            />
          </div>
          
          {/* Filtro de estado */}
          <div>
            <Label htmlFor="status" className="text-gray-400">Estado</Label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="suspended">Suspendido</option>
            </select>
          </div>
          
          {/* Filtro de categoría */}
          <div>
            <Label htmlFor="category" className="text-gray-400">Categoría</Label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as UserCategory | 'all')}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todas las categorías</option>
              <option value="Basic">Básico</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
              <option value="Elite">Elite</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Lista de usuarios */}
          <div className="w-full md:w-2/3">
            <Card className="bg-gray-900 border-gray-800 shadow-md">
              <CardHeader className="bg-gray-950 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Users className="mr-2 h-5 w-5 text-green-500" />
                    Usuarios ({filteredUsers.length})
                  </CardTitle>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Admin Manager View
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">
                  La gestión de usuarios permite modificar estados y niveles, pero no eliminar datos
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-800 border-b border-gray-800">
                        <TableHead className="text-gray-400">Usuario</TableHead>
                        <TableHead className="text-gray-400">Estado</TableHead>
                        <TableHead className="text-gray-400">Categoría</TableHead>
                        <TableHead className="text-gray-400">Registrado</TableHead>
                        <TableHead className="text-gray-400">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow 
                            key={user.id} 
                            className="hover:bg-gray-800 border-b border-gray-800 cursor-pointer"
                            onClick={() => handleUserSelect(user)}
                          >
                            <TableCell>
                              <div className="font-medium text-white">{user.name}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </TableCell>
                            <TableCell>{renderStatus(user.status)}</TableCell>
                            <TableCell>{renderCategory(user.category)}</TableCell>
                            <TableCell className="text-gray-400">
                              {new Date(user.dateCreated).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUserSelect(user);
                                }}
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-gray-400">
                            No se encontraron usuarios que coincidan con los criterios de búsqueda
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalles del usuario seleccionado */}
          <div className="w-full md:w-1/3">
            <Card className="bg-gray-900 border-gray-800 shadow-md">
              <CardHeader className="bg-gray-950 border-b border-gray-800">
                <CardTitle className="text-white">Detalles del Usuario</CardTitle>
                <CardDescription className="text-gray-400">
                  {selectedUser 
                    ? `Información completa de ${selectedUser.name}`
                    : 'Selecciona un usuario para ver detalles'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {selectedUser ? (
                  <div>
                    <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-800">
                      <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                        {selectedUser.avatarUrl ? (
                          <img 
                            src={selectedUser.avatarUrl} 
                            alt={`Avatar de ${selectedUser.name}`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-green-500">
                            {selectedUser.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{selectedUser.name}</h3>
                      <p className="text-gray-400">{selectedUser.email}</p>
                      <div className="mt-3 flex space-x-2">
                        {renderStatus(selectedUser.status)}
                        {renderCategory(selectedUser.category)}
                      </div>
                      <div className="mt-4 w-full space-y-2">
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Gestión de Avatares</h4>
                        
                        <div className="flex flex-col space-y-3">
                          {/* Selector de avatares 2D */}
                          <div className="flex items-center">
                            <span className="text-gray-400 text-sm mr-2">Avatar 2D:</span>
                            <AvatarSelector
                              userId={parseInt(selectedUser.id)}
                              currentAvatarUrl={selectedUser.avatarUrl}
                              size="md"
                              onSelectAvatar={(avatar: { id: string; imageUrl: string }) => {
                                logAdminActivity(`Changed avatar for user: ${selectedUser.name} (${selectedUser.id})`);
                                
                                // Actualizar el usuario con la nueva imagen de avatar
                                const updatedUsers = users.map(user => 
                                  user.id === selectedUser.id ? { 
                                    ...user, 
                                    avatarUrl: avatar.imageUrl,
                                    avatarId: avatar.id
                                  } : user
                                );
                                setUsers(updatedUsers);
                                
                                // Actualizar el usuario seleccionado
                                setSelectedUser({
                                  ...selectedUser,
                                  avatarUrl: avatar.imageUrl,
                                  avatarId: avatar.id
                                });
                              }}
                            />
                          </div>
                          
                          {/* Importador de avatares 3D */}
                          <div className="pb-1">
                            <ReadyPlayerMeAvatar 
                              userId={parseInt(selectedUser.id)} 
                              isAdmin={true}
                              onAvatarCreated={(avatar: { id: string; imageUrl: string }) => {
                                logAdminActivity(`Created 3D avatar for user: ${selectedUser.name} (${selectedUser.id})`);
                                
                                // Actualizar el usuario con la nueva imagen de avatar
                                const updatedUsers = users.map(user => 
                                  user.id === selectedUser.id ? { 
                                    ...user, 
                                    avatarUrl: avatar.imageUrl,
                                    avatarId: avatar.id
                                  } : user
                                );
                                setUsers(updatedUsers);
                                
                                // Actualizar el usuario seleccionado
                                setSelectedUser({
                                  ...selectedUser,
                                  avatarUrl: avatar.imageUrl,
                                  avatarId: avatar.id
                                });
                                
                                toast({
                                  title: "Avatar 3D creado",
                                  description: `Se ha creado un nuevo avatar 3D para ${selectedUser.name}`,
                                  variant: "default"
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Información básica */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Información</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-400">ID:</dt>
                            <dd className="text-white font-medium">{selectedUser.id}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-400">Fecha de registro:</dt>
                            <dd className="text-white">
                              {new Date(selectedUser.dateCreated).toLocaleDateString()}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-400">Último acceso:</dt>
                            <dd className="text-white">
                              {new Date(selectedUser.lastLogin).toLocaleDateString()}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-400">Código de acceso:</dt>
                            <dd className="text-white font-mono">{selectedUser.accessCode || "N/A"}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Gestión de estado */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Gestionar Estado</h4>
                        <div className="space-y-2">
                          <Button
                            variant={selectedUser.status === 'active' ? "default" : "outline"}
                            size="sm"
                            className={`w-full justify-start ${
                              selectedUser.status === 'active' 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'border-gray-700 hover:bg-gray-800'
                            }`}
                            onClick={() => handleStatusChange(selectedUser.id, 'active')}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activo
                          </Button>
                          <Button
                            variant={selectedUser.status === 'inactive' ? "default" : "outline"}
                            size="sm"
                            className={`w-full justify-start ${
                              selectedUser.status === 'inactive' 
                                ? 'bg-gray-600 hover:bg-gray-700' 
                                : 'border-gray-700 hover:bg-gray-800'
                            }`}
                            onClick={() => handleStatusChange(selectedUser.id, 'inactive')}
                          >
                            <EyeOff className="mr-2 h-4 w-4" />
                            Inactivo
                          </Button>
                          <Button
                            variant={selectedUser.status === 'suspended' ? "default" : "outline"}
                            size="sm"
                            className={`w-full justify-start ${
                              selectedUser.status === 'suspended' 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'border-gray-700 hover:bg-gray-800'
                            }`}
                            onClick={() => handleStatusChange(selectedUser.id, 'suspended')}
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Suspendido
                          </Button>
                        </div>
                      </div>

                      {/* Gestión de categoría */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Gestionar Categoría</h4>
                        <select
                          value={selectedUser.category}
                          onChange={(e) => handleCategoryChange(selectedUser.id, e.target.value as UserCategory)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="Basic">Básico</option>
                          <option value="Premium">Premium</option>
                          <option value="VIP">VIP</option>
                          <option value="Elite">Elite</option>
                        </select>
                      </div>

                      {/* Acciones especiales */}
                      <div className="pt-4 border-t border-gray-800">
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Acciones</h4>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start border-gray-700 hover:bg-gray-800"
                            onClick={() => {
                              logAdminActivity(`Reset password requested for: ${selectedUser.name} (${selectedUser.id})`);
                              toast({
                                title: "Acción registrada",
                                description: `Se ha enviado la solicitud de reinicio de contraseña para ${selectedUser.name}`,
                                variant: "default"
                              });
                            }}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Reiniciar contraseña
                          </Button>
                          
                          {/* Botón deshabilitado para manager - solo informativo */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-gray-500 border-gray-800 hover:bg-transparent cursor-not-allowed"
                            disabled={true}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Eliminar usuario
                            <span className="ml-auto text-xs bg-gray-800 px-1 rounded">
                              Restringido
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="mx-auto h-12 w-12 text-gray-600 mb-3" />
                    <p>Selecciona un usuario de la lista para ver sus detalles y opciones de gestión</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}