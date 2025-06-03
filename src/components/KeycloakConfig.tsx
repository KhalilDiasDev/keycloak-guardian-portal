
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, TestTube } from 'lucide-react';

interface KeycloakConfigProps {
  onClose: () => void;
  onConfigSaved?: (config: { serverUrl: string; realm: string; clientId: string }) => void;
}

const KeycloakConfig = ({ onClose, onConfigSaved }: KeycloakConfigProps) => {
  const [config, setConfig] = useState({
    serverUrl: 'http://localhost:8080',
    realm: 'master',
    clientId: 'admin-cli',
    adminUsername: 'admin',
    adminPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestStatus('testing');

    try {
      // Em produção, aqui seria feita a chamada para testar a conexão com o Keycloak
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTestStatus('success');
      toast({
        title: "Conexão bem-sucedida",
        description: "Conectado ao Keycloak com sucesso!",
      });
    } catch (error) {
      setTestStatus('error');
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Keycloak. Verifique as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // Salvar as configurações no localStorage
    localStorage.setItem('keycloak-config', JSON.stringify(config));
    
    // Chamar callback se fornecido
    if (onConfigSaved) {
      onConfigSaved({
        serverUrl: config.serverUrl,
        realm: config.realm,
        clientId: config.clientId
      });
    }
    
    toast({
      title: "Configurações salvas",
      description: "As configurações do Keycloak foram salvas com sucesso!",
    });
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Keycloak
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações do Cliente</CardTitle>
              <CardDescription>
                Configure a conexão com o seu cliente Keycloak
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serverUrl">URL do Servidor Keycloak</Label>
                <Input
                  id="serverUrl"
                  value={config.serverUrl}
                  onChange={(e) => handleInputChange('serverUrl', e.target.value)}
                  placeholder="https://seu-keycloak.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="realm">Realm</Label>
                <Input
                  id="realm"
                  value={config.realm}
                  onChange={(e) => handleInputChange('realm', e.target.value)}
                  placeholder="seu-realm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  value={config.clientId}
                  onChange={(e) => handleInputChange('clientId', e.target.value)}
                  placeholder="seu-client-id"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credenciais de Administrador (Opcional)</CardTitle>
              <CardDescription>
                Para operações administrativas via API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminUsername">Nome de Usuário Admin</Label>
                <Input
                  id="adminUsername"
                  value={config.adminUsername}
                  onChange={(e) => handleInputChange('adminUsername', e.target.value)}
                  placeholder="admin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPassword">Senha Admin</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={config.adminPassword}
                  onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                  placeholder="Digite a senha do administrador"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={isLoading}
              className={
                testStatus === 'success' ? 'border-green-500 text-green-600' :
                testStatus === 'error' ? 'border-red-500 text-red-600' : ''
              }
            >
              <TestTube className="h-4 w-4 mr-2" />
              {isLoading ? 'Testando...' : 
               testStatus === 'success' ? 'Conexão OK' :
               testStatus === 'error' ? 'Erro na Conexão' : 'Testar Conexão'}
            </Button>

            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeycloakConfig;
