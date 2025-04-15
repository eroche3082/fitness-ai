import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const SuperAdminQRLogin = () => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [qrSessionId, setQrSessionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Genera un ID de sesión único para este QR
  const generateSessionId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000000);
    return `fitnessai-admin-${timestamp}-${random}`;
  };

  // Genera el QR code con el sessionId
  const generateQR = async () => {
    setLoading(true);
    try {
      // Generar un nuevo sessionId
      const sessionId = generateSessionId();
      setQrSessionId(sessionId);
      
      // Crear la URL que contendrá el sessionId
      const qrData = `${window.location.origin}/superadmin/mobile-auth?session=${sessionId}`;
      
      // Generar QR code como data URL
      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#10b981', // Verde para el dibujo del QR
          light: '#000000' // Fondo negro
        }
      });
      
      setQrUrl(qrCodeUrl);
      
      // Registrar la sesión en el backend
      await fetch('/api/superadmin/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      
    } catch (error) {
      console.error('Error generando QR:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el código QR. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar el estado de autenticación periódicamente
  const checkAuthStatus = async () => {
    if (!qrSessionId || checkingStatus) return;
    
    setCheckingStatus(true);
    try {
      const response = await fetch(`/api/superadmin/check-session?sessionId=${qrSessionId}`);
      const data = await response.json();
      
      if (data.authenticated) {
        toast({
          title: 'Autenticación exitosa',
          description: 'Bienvenida, Capitana. Accediendo al panel de Super Admin...',
        });
        navigate('/superadmin/dashboard');
      }
    } catch (error) {
      console.error('Error verificando estado de autenticación:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  // Generar QR al cargar la página
  useEffect(() => {
    generateQR();
    
    // Limpiar al desmontar
    return () => {
      // Cancelar la sesión si el usuario abandona la página
      if (qrSessionId) {
        fetch('/api/superadmin/cancel-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId: qrSessionId }),
        }).catch(console.error);
      }
    };
  }, []);

  // Verificar estado de autenticación cada 3 segundos
  useEffect(() => {
    if (!qrSessionId) return;
    
    const interval = setInterval(checkAuthStatus, 3000);
    
    return () => clearInterval(interval);
  }, [qrSessionId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <Card className="w-full max-w-md border-green-500 bg-black text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-500">Acceso Super Admin</CardTitle>
          <CardDescription className="text-gray-400">
            Escanea el código QR con tu dispositivo móvil para iniciar la autenticación biométrica
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {loading ? (
            <div className="w-[300px] h-[300px] flex items-center justify-center">
              <div className="animate-spin w-12 h-12 border-4 border-t-green-500 border-green-500/30 rounded-full"></div>
            </div>
          ) : (
            <div className="relative p-2 bg-white rounded-lg">
              <img src={qrUrl} alt="QR Code para autenticación" className="w-[300px] h-[300px]" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full">
                <img src="/icons/fitness-ai-icon.png" alt="Fitness AI" className="w-12 h-12" />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-xs text-center text-gray-400">
            Este código expirará en 5 minutos. Solo La Capitana puede acceder a este panel.
          </p>
          <Button 
            variant="outline" 
            className="w-full border-green-500 text-green-500 hover:bg-green-950"
            onClick={generateQR}
            disabled={loading}
          >
            Generar nuevo código
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuperAdminQRLogin;