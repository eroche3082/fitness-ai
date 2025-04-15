import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Activity, Check } from 'lucide-react';
import { generateUniqueCode } from '../lib/userCodeGenerator';

// Importar estilos CSS para la página de login
import '../styles/app-mobile.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'accessCode'>('credentials');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [generatedCode, setGeneratedCode] = useState('FIT-VIP-' + Math.floor(1000 + Math.random() * 9000));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (loginMethod === 'credentials') {
      try {
        console.log("Intentando login con:", username, password);
        const success = login(username, password);
        console.log("Resultado del login:", success);
        
        if (success) {
          setLocation('/dashboard');
        } else {
          setError('Credenciales inválidas. Prueba con demo/demo123');
        }
      } catch (err) {
        console.error("Error de login:", err);
        setError('Ocurrió un error durante el inicio de sesión');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle access code login
      try {
        console.log("Intentando login con código:", accessCode);
        // For demo purposes, any code starting with FIT- will work
        if (accessCode && accessCode.startsWith('FIT-')) {
          setLocation('/dashboard');
        } else {
          setError('Código de acceso inválido. Prueba con ' + generatedCode);
        }
      } catch (err) {
        console.error("Error de código de acceso:", err);
        setError('Ocurrió un error al procesar tu código de acceso');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDemoLogin = async () => {
    setUsername('demo');
    setPassword('demo123');
    setLoginMethod('credentials');
    setIsLoading(true);
    
    // Short timeout to ensure the state updates before login attempt
    setTimeout(() => {
      try {
        console.log("Intentando login con cuenta demo");
        const success = login('demo', 'demo123');
        console.log("Resultado del login demo:", success);
        
        if (success) {
          setLocation('/dashboard');
        } else {
          setError('Error al usar la cuenta demo. Inténtalo de nuevo.');
          console.error('Demo login failed');
        }
      } catch (err) {
        setError('Ocurrió un error inesperado con la cuenta demo');
        console.error('Demo login error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="w-full py-4 fixed top-0 z-50 bg-black shadow-md border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="link" 
              onClick={() => setLocation('/bridge')}
              className="flex items-center text-white hover:text-green-500 transition-colors"
            >
              <Activity className="h-6 w-6 mr-2 text-green-500" />
              <h1 className="text-2xl font-bold tracking-tighter">
                <span className="text-white">FITNESS</span>
                <span className="text-green-500">AI</span>
              </h1>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white">AI Assistant</h2>
            <p className="text-gray-400">Log in to access your fitness platform</p>
          </div>

          <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
            {/* Tab Navigation */}
            <div className="flex rounded-md bg-gray-900 p-1 mb-6">
              <button
                onClick={() => setLoginMethod('credentials')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors 
                  ${loginMethod === 'credentials'
                    ? 'bg-black text-green-500 shadow-sm border border-green-500' 
                    : 'hover:bg-gray-800 text-gray-400'
                  }`}
              >
                Credentials
              </button>
              <button
                onClick={() => setLoginMethod('accessCode')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors 
                  ${loginMethod === 'accessCode'
                    ? 'bg-black text-green-500 shadow-sm border border-green-500' 
                    : 'hover:bg-gray-800 text-gray-400'
                  }`}
              >
                Access Code
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 text-red-400 border border-red-800 p-3 rounded-md text-sm mb-6">
                {error}
              </div>
            )}

            {/* Credentials Form */}
            {loginMethod === 'credentials' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-900 text-gray-300 border border-gray-700 p-3 rounded-md text-sm mb-4">
                  <p className="font-semibold mb-1 text-green-400">Login con cualquiera de estas cuentas:</p>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li><strong className="text-white">Username:</strong> demo | <strong className="text-white">Password:</strong> demo123</li>
                    <li><strong className="text-white">Username:</strong> admin | <strong className="text-white">Password:</strong> admin123456</li>
                    <li><strong className="text-white">Username:</strong> testuser | <strong className="text-white">Password:</strong> password</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                    placeholder="example: admin"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                    placeholder="example: admin123456"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Iniciar Sesión
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              // Access Code Form
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-white">Tu Código de Acceso</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Ingresa el código que recibiste durante tu registro.
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <Input
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white focus:border-green-500 focus:ring-green-500 mb-4"
                      placeholder={`Example: ${generatedCode}`}
                      required
                    />
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
                    >
                      Acceder al Dashboard
                    </Button>
                  </form>
                </div>
                
                <div className="bg-gray-900 border border-gray-700 rounded-md p-4 text-center">
                  <p className="text-sm text-green-400 mb-2">Tu código personal:</p>
                  <p className="text-xl font-bold text-green-500">{generatedCode}</p>
                </div>
                
                <div className="text-center text-sm text-gray-400">
                  <p>Accede a tu dashboard personalizado usando el código generado durante tu registro.</p>
                </div>
              </div>
            )}

            {loginMethod === 'credentials' && (
              <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                <p className="text-gray-400 mb-4">¿No tienes una cuenta? Prueba el demo</p>
                <Button
                  variant="outline"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full border-green-600 text-green-500 hover:bg-green-600 hover:text-white"
                >
                  Usar Cuenta Demo
                </Button>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setLocation('/bridge')}
              className="text-green-500 hover:text-green-400 font-medium"
            >
              ← Volver a la página principal
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}