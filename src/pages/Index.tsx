import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Users, Plus, Search, LogIn, Shield, Activity, Stethoscope, ChevronRight, Star, User, Calendar } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  condition: string;
  lastVisit: string;
  status: 'active' | 'inactive';
}

const HealthFlow = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadPatients();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPatients([]);
  };

  const loadPatients = () => {
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        phone: '(11) 99999-9999',
        age: 45,
        condition: 'Hipertensão',
        lastVisit: '2025-05-28',
        status: 'active'
      },
      {
        id: '2',
        name: 'Carlos Santos',
        email: 'carlos.santos@email.com',
        phone: '(11) 88888-8888',
        age: 32,
        condition: 'Diabetes Tipo 2',
        lastVisit: '2025-05-25',
        status: 'active'
      },
      {
        id: '3',
        name: 'Maria Costa',
        email: 'maria.costa@email.com',
        phone: '(11) 77777-7777',
        age: 67,
        condition: 'Artrite',
        lastVisit: '2025-05-20',
        status: 'inactive'
      }
    ];
    setPatients(mockPatients);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-green-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    HealthFlow
                  </h1>
                  <p className="text-sm text-green-600">Sistema de Gestão Médica</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-green-200 text-green-700 hover:bg-green-50">
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Pacientes</p>
                    <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pacientes Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {patients.filter(patient => patient.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Consultas Hoje</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Management */}
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-green-800">Gestão de Pacientes</CardTitle>
                  <CardDescription className="text-green-600">
                    Visualize e gerencie informações dos pacientes
                  </CardDescription>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Paciente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar pacientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-400"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-green-200">
                      <th className="text-left py-3 px-4 font-medium text-green-800">Nome</th>
                      <th className="text-left py-3 px-4 font-medium text-green-800">Idade</th>
                      <th className="text-left py-3 px-4 font-medium text-green-800">Condição</th>
                      <th className="text-left py-3 px-4 font-medium text-green-800">Última Consulta</th>
                      <th className="text-left py-3 px-4 font-medium text-green-800">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-green-100 hover:bg-green-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-full mr-3">
                              <User className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{patient.name}</p>
                              <p className="text-sm text-gray-500">{patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{patient.age} anos</td>
                        <td className="py-3 px-4 text-gray-700">{patient.condition}</td>
                        <td className="py-3 px-4 text-gray-700">{new Date(patient.lastVisit).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patient.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {patient.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HealthFlow</span>
            </div>
            <Button 
              onClick={handleLogin}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Acessar Sistema
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-200 text-sm mb-8">
              <Stethoscope className="h-4 w-4 mr-2" />
              Tecnologia a Serviço da Saúde
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Cuidado Digital
              <span className="block bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                Inteligente
              </span>
            </h1>
            
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Plataforma completa para gestão médica. Prontuários eletrônicos, 
              agendamentos e monitoramento de pacientes em um só lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleLogin}
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Heart className="h-5 w-5 mr-2" />
                Começar Agora
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
              >
                Saiba Mais
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Recursos Essenciais
            </h2>
            <p className="text-gray-200 text-lg max-w-xl mx-auto">
              Tudo que você precisa para uma gestão médica eficiente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 group-hover:shadow-2xl transition-all duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Prontuário Seguro</h3>
                <p className="text-gray-200">
                  Dados protegidos com criptografia avançada e backup automático.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-6 group-hover:shadow-2xl transition-all duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Agendamentos</h3>
                <p className="text-gray-200">
                  Sistema inteligente de marcação com lembretes automáticos.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-6 group-hover:shadow-2xl transition-all duration-300">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Monitoramento</h3>
                <p className="text-gray-200">
                  Acompanhamento contínuo da evolução dos pacientes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                5K+
              </div>
              <p className="text-gray-200">Pacientes Ativos</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                150+
              </div>
              <p className="text-gray-200">Médicos Cadastrados</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-teal-300 to-green-300 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                99.8%
              </div>
              <p className="text-gray-200">Disponibilidade</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <p className="text-gray-200">Suporte Médico</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-white/10 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Revolucione seu Atendimento
            </h2>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Junte-se aos profissionais que já transformaram sua prática médica com nossa tecnologia.
            </p>
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Heart className="h-5 w-5 mr-2" />
              Começar Gratuitamente
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">HealthFlow</span>
            </div>
            <p className="text-gray-300 text-sm">
              © 2025 HealthFlow. Cuidando da sua saúde digital.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HealthFlow;
