
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import UserRegistrationForm from '@/components/UserRegistrationForm';
import UserEditForm from '@/components/UserEditForm';
import UserTable from '@/components/UserTable';
import KeycloakConfig from '@/components/KeycloakConfig';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  createdTimestamp: number;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock authentication - em produção, integrar com Keycloak
  const handleLogin = () => {
    setIsAuthenticated(true);
    loadUsers();
    toast({
      title: "Login realizado com sucesso",
      description: "Bem-vindo ao painel de administração",
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsers([]);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com segurança",
    });
  };

  const loadUsers = () => {
    // Mock data - em produção, carregar do Keycloak
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@empresa.com',
        firstName: 'Admin',
        lastName: 'Sistema',
        enabled: true,
        createdTimestamp: Date.now() - 86400000
      },
      {
        id: '2',
        username: 'joao.silva',
        email: 'joao.silva@empresa.com',
        firstName: 'João',
        lastName: 'Silva',
        enabled: true,
        createdTimestamp: Date.now() - 172800000
      },
      {
        id: '3',
        username: 'maria.santos',
        email: 'maria.santos@empresa.com',
        firstName: 'Maria',
        lastName: 'Santos',
        enabled: false,
        createdTimestamp: Date.now() - 259200000
      }
    ];
    setUsers(mockUsers);
  };

  const handleUserCreated = (user: User) => {
    setUsers([...users, user]);
    setShowRegisterForm(false);
    toast({
      title: "Usuário criado",
      description: `O usuário ${user.username} foi criado com sucesso`,
    });
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setShowEditForm(false);
    setSelectedUser(null);
    toast({
      title: "Usuário atualizado",
      description: `O usuário ${updatedUser.username} foi atualizado com sucesso`,
    });
  };

  const handleUserDeleted = (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Usuário excluído",
      description: `O usuário ${userToDelete?.username} foi excluído com sucesso`,
      variant: "destructive",
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditForm(true);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Keycloak Guardian Portal</CardTitle>
            <CardDescription>
              Sistema de gerenciamento de usuários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input id="username" placeholder="Digite seu usuário" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="Digite sua senha" />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Entrar
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setShowConfig(true)}
            >
              Configurar Keycloak
            </Button>
          </CardContent>
        </Card>

        {showConfig && (
          <KeycloakConfig onClose={() => setShowConfig(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Keycloak Guardian Portal
                </h1>
                <p className="text-sm text-gray-500">Gerenciamento de Usuários</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowConfig(true)}
              >
                Configurações
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(user => user.enabled).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trash2 className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuários Inativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(user => !user.enabled).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie usuários do Keycloak
                </CardDescription>
              </div>
              <Button onClick={() => setShowRegisterForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <UserTable
              users={filteredUsers}
              onEdit={handleEditUser}
              onDelete={handleUserDeleted}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showRegisterForm && (
        <UserRegistrationForm
          onClose={() => setShowRegisterForm(false)}
          onUserCreated={handleUserCreated}
        />
      )}

      {showEditForm && selectedUser && (
        <UserEditForm
          user={selectedUser}
          onClose={() => {
            setShowEditForm(false);
            setSelectedUser(null);
          }}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {showConfig && (
        <KeycloakConfig onClose={() => setShowConfig(false)} />
      )}
    </div>
  );
};

export default Index;
