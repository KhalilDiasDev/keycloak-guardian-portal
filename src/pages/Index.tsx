import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Heart, Users, Plus, Search, LogIn, Shield, Activity, Stethoscope, ChevronRight, Star, CheckCircle, ArrowRight, Play, UserCheck, Zap } from 'lucide-react';
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
        username: 'dr.admin',
        email: 'admin@clinica.com',
        firstName: 'Dr. Admin',
        lastName: 'Sistema',
        enabled: true,
        createdTimestamp: Date.now() - 86400000
      },
      {
        id: '2',
        username: 'dr.silva',
        email: 'dr.silva@clinica.com',
        firstName: 'Dr. João',
        lastName: 'Silva',
        enabled: true,
        createdTimestamp: Date.now() - 172800000
      },
      {
        id: '3',
        username: 'enf.santos',
        email: 'maria.santos@clinica.com',
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
        description: "Bem-vindo ao sistema de gestão de saúde",
      });
    }
  }, [isAuthenticated]);

  const handleUserCreated = (user: User) => {
    setUsers([...users, user]);
    setShowRegisterForm(false);
    toast({
      title: "Profissional cadastrado",
      description: `O profissional ${user.username} foi cadastrado com sucesso`,
    });
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setShowEditForm(false);
    setSelectedUser(null);
    toast({
      title: "Profissional atualizado",
      description: `O profissional ${updatedUser.username} foi atualizado com sucesso`,
    });
  };

  const handleUserDeleted = (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Profissional removido",
      description: `O profissional ${userToDelete?.username} foi removido com sucesso`,
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
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-800">Erro de Configuração</CardTitle>
            <CardDescription className="text-red-600">
              Configurações do sistema não encontradas
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
              Reinicie o servidor após configurar o .env
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
                <Heart className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    HealthFlow Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">Gestão de Profissionais de Saúde</p>
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
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Profissionais</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Profissionais Ativos</p>
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
                    <p className="text-sm font-medium text-gray-600">Profissionais Inativos</p>
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
                  <CardTitle>Gestão de Profissionais de Saúde</CardTitle>
                  <CardDescription>
                    Visualize e gerencie profissionais do sistema
                  </CardDescription>
                </div>
                <Button onClick={() => setShowRegisterForm(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Profissional
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar profissionais..."
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

  // Landing Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-green-800">HealthFlow</span>
            </div>
            <Button 
              onClick={handleKeycloakLogin}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
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
            <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full text-green-700 text-sm mb-8 animate-fade-in">
              <div className="h-4 w-4 mr-2" />
              Revolucionando o Cuidado com a Saúde
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-green-800 mb-6 leading-tight">
              Saúde Digital
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Sem Fronteiras
              </span>
            </h1>
            
            <p className="text-xl text-green-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              A plataforma mais avançada para gestão de profissionais de saúde e cuidado ao paciente. 
              Conecte, proteja e otimize o atendimento médico com tecnologia de ponta 
              e monitoramento em tempo real.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleKeycloakLogin}
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Play className="h-5 w-5 mr-2" />
                Começar Agora
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-green-300 text-green-700 hover:bg-green-50 px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
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
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
              Recursos Que Transformam o Cuidado
            </h2>
            <p className="text-green-700 text-lg max-w-2xl mx-auto">
              Tecnologia avançada para melhorar a qualidade do atendimento médico
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-md border-green-200 hover:bg-white/90 transition-all duration-300 group hover:scale-105 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 group-hover:shadow-2xl transition-all duration-300">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-4">Diagnóstico Inteligente</h3>
                <p className="text-green-700">
                  Ferramentas avançadas de análise e diagnóstico para melhor tomada de decisão clínica.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-md border-green-200 hover:bg-white/90 transition-all duration-300 group hover:scale-105 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mb-6 group-hover:shadow-2xl transition-all duration-300">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-4">Monitoramento Contínuo</h3>
                <p className="text-green-700">
                  Acompanhamento em tempo real dos sinais vitais e indicadores de saúde dos pacientes.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-md border-green-200 hover:bg-white/90 transition-all duration-300 group hover:scale-105 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full mb-6 group-hover:shadow-2xl transition-all duration-300">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-4">Cuidado Personalizado</h3>
                <p className="text-green-700">
                  Planos de tratamento individualizados com base no histórico e perfil de cada paciente.
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
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <p className="text-green-700">Disponibilidade</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                50K+
              </div>
              <p className="text-green-700">Pacientes Atendidos</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <p className="text-green-700">Suporte Médico</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                95%
              </div>
              <p className="text-green-700">Satisfação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
              Confiado por Profissionais de Saúde
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Dra. Ana Cardoso", role: "Cardiologista, Hospital Central", content: "HealthFlow revolucionou nossa abordagem ao cuidado cardíaco. Interface intuitiva e dados precisos." },
              { name: "Dr. Carlos Mendes", role: "Diretor Médico, Clínica Vida", content: "Reduzimos o tempo de diagnóstico em 60%. Uma ferramenta essencial para medicina moderna." },
              { name: "Enf. Maria Santos", role: "Coordenadora, UTI Premium", content: "O monitoramento em tempo real salvou inúmeras vidas. Tecnologia que realmente faz a diferença." }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-md border-green-200 hover:bg-white/90 transition-all duration-300 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-green-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="text-green-800 font-medium">{testimonial.name}</p>
                    <p className="text-green-600 text-sm">{testimonial.role}</p>
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-md border border-green-200 rounded-3xl p-12 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
              Pronto para Transformar o Cuidado com a Saúde?
            </h2>
            <p className="text-green-700 text-lg mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais de saúde que confiam no HealthFlow para oferecer o melhor cuidado aos seus pacientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleKeycloakLogin}
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Heart className="h-5 w-5 mr-2" />
                Começar Gratuitamente
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-green-300 text-green-700 hover:bg-green-50 px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
              >
                Falar com Especialista
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-green-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-green-800">HealthFlow</span>
            </div>
            <p className="text-green-600 text-sm">
              © 2025 HealthFlow. Todos os direitos reservados. Cuidando da sua saúde com tecnologia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
