import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Plus, Search, LogIn, Lock, Zap, Globe, ChevronRight, Star, CheckCircle, ArrowRight, Play } from 'lucide-react';
import UserRegistrationForm from '@/components/UserRegistrationForm';
import UserEditForm from '@/components/UserEditForm';
import UserTable from '@/components/UserTable';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  createdTimestamp: number;
}

interface KeycloakConfig {
  serverUrl: string;
  realm: string;
  clientId: string;
}

// Configuração do Keycloak a partir das variáveis de ambiente
const getKeycloakConfig = (): KeycloakConfig | null => {
  const serverUrl = import.meta.env.VITE_KEYCLOAK_SERVER_URL;
  const realm = import.meta.env.VITE_KEYCLOAK_REALM;
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

  if (!serverUrl || !realm || !clientId) {
    console.error('Configurações do Keycloak não encontradas no .env');
    return null;
  }

  return {
    serverUrl,
    realm,
    clientId
  };
};

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [keycloakConfig] = useState<KeycloakConfig | null>(getKeycloakConfig());
  const { toast } = useToast();

  // Função para redirecionar para o Keycloak
  const handleKeycloakLogin = () => {
    if (!keycloakConfig) {
      toast({
        title: "Erro de configuração",
        description: "Configurações do Keycloak não encontradas. Verifique o arquivo .env",
        variant: "destructive",
      });
      return;
    }

    const { serverUrl, realm, clientId } = keycloakConfig;
    const redirectUri = encodeURIComponent(window.location.origin);
    const keycloakLoginUrl = `${serverUrl}/realms/${realm}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`;
    
    window.location.href = keycloakLoginUrl;
  };

  const handleLogout = () => {
    if (!keycloakConfig) return;

    const { serverUrl, realm } = keycloakConfig;
    const redirectUri = encodeURIComponent(window.location.origin);
    const keycloakLogoutUrl = `${serverUrl}/realms/${realm}/protocol/openid-connect/logout?redirect_uri=${redirectUri}`;
    
    setIsAuthenticated(false);
    setUsers([]);
    
    // Redirecionar para logout do Keycloak
    window.location.href = keycloakLogoutUrl;
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

  // Simular retorno do Keycloak (em produção, processar o código de autorização)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !isAuthenticated) {
      // Em produção, trocar o código por token usando a API do Keycloak
      console.log('Código de autorização recebido:', code);
      setIsAuthenticated(true);
      loadUsers();
      
      // Limpar URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel de administração",
      });
    }
  }, [isAuthenticated]);

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

  // Verificar se as configurações estão disponíveis
  if (!keycloakConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-800">Erro de Configuração</CardTitle>
            <CardDescription className="text-red-600">
              Configurações do Keycloak não encontradas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 mb-2">
                <strong>Verifique se o arquivo .env contém:</strong>
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• VITE_KEYCLOAK_SERVER_URL</li>
                <li>• VITE_KEYCLOAK_REALM</li>
                <li>• VITE_KEYCLOAK_CLIENT_ID</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Reinicie o servidor de desenvolvimento após configurar o .env
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAuthenticated) {
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
                    SecureFlow Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">Gerenciamento de Usuários</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-xs text-gray-500">
                  {keycloakConfig.realm} @ {keycloakConfig.serverUrl}
                </div>
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
                  <Shield className="h-8 w-8 text-red-600" />
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
      </div>
    );
  }

  // Landing Pagee
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SecureFlow</span>
            </div>
            <Button 
              onClick={handleKeycloakLogin}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm mb-8 animate-fade-in">
              <Zap className="h-4 w-4 mr-2" />
              Revolucionando a Gestão de Identidade
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Segurança Digital
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Sem Limites
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              A plataforma mais avançada para gerenciamento de identidade e acesso. 
              Proteja sua organização com autenticação inteligente, controle granular 
              e monitoramento em tempo real.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleKeycloakLogin}
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Play className="h-5 w-5 mr-2" />
                Começar Agora
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
              >
                Ver Demo
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Recursos Que Fazem a Diferença
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Tecnologia de ponta para proteger o que mais importa para sua empresa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6 group-hover:shadow-2xl transition-all duration-300">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Autenticação Avançada</h3>
                <p className="text-gray-300">
                  Multi-fator, biométrica e adaptativa. Segurança máxima com experiência fluida.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-6 group-hover:shadow-2xl transition-all duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Gestão Inteligente</h3>
                <p className="text-gray-300">
                  Controle centralizado de usuários, permissões e políticas com automação completa.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-green-600 to-purple-600 rounded-full mb-6 group-hover:shadow-2xl transition-all duration-300">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Escalabilidade Global</h3>
                <p className="text-gray-300">
                  Suporte para milhões de usuários em qualquer lugar do mundo, 24/7.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <p className="text-gray-300">Uptime Garantido</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                10M+
              </div>
              <p className="text-gray-300">Usuários Protegidos</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
              </div>
              <p className="text-gray-300">Tempo de Resposta</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                150+
              </div>
              <p className="text-gray-300">Países Atendidos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Confiado por Líderes Globais
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Ana Silva", role: "CTO, TechCorp", content: "SecureFlow transformou nossa segurança digital. Implementação perfeita e suporte excepcional." },
              { name: "Carlos Santos", role: "CISO, GlobalBank", content: "A melhor solução de IAM que já utilizamos. Reduzimos incidentes de segurança em 95%." },
              { name: "Maria Costa", role: "CEO, InnovaTech", content: "Interface intuitiva e recursos avançados. Nossa equipe adotou a plataforma instantaneamente." }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-white/10 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para Revolucionar sua Segurança?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de empresas que confiam no SecureFlow para proteger seus ativos digitais mais valiosos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleKeycloakLogin}
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Shield className="h-5 w-5 mr-2" />
                Começar Gratuitamente
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
              >
                Falar com Especialista
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">SecureFlow</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 SecureFlow. Todos os direitos reservados. Segurança é nossa prioridade.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
