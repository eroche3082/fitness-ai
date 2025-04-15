import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Check, Loader2, Video } from 'lucide-react';

// Componente para el reconocimiento facial
const FaceRecognition = ({ sessionId, onSuccess, onError }: { 
  sessionId: string, 
  onSuccess: () => void, 
  onError: (message: string) => void 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [captureComplete, setCaptureComplete] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  // Iniciar cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
      onError('No se pudo acceder a la cámara. Por favor, permite el acceso para la autenticación.');
    }
  };

  // Detener cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Capturar imagen para reconocimiento facial
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;
    
    setIsCapturing(true);
    
    // Cuenta regresiva de 3 segundos
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(countdownInterval);
        
        // Capturar la imagen
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (!video || !canvas) return;
        
        const context = canvas.getContext('2d');
        
        if (context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convertir a base64
          const imageData = canvas.toDataURL('image/jpeg');
          
          // Enviar para verificación biométrica
          submitFaceAuth(imageData);
        }
      }
    }, 1000);
  };

  // Enviar imagen para autenticación
  const submitFaceAuth = async (imageData: string) => {
    setProcessing(true);
    try {
      // Eliminar el prefijo de data URL
      const base64Image = imageData.split(',')[1];
      
      const response = await fetch('/api/superadmin/face-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          faceImage: base64Image
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCaptureComplete(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        onError(data.message || 'Autenticación facial fallida. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error en autenticación facial:', error);
      onError('Error durante la verificación facial. Por favor, intenta de nuevo.');
    } finally {
      setIsCapturing(false);
      setProcessing(false);
    }
  };

  // Iniciar cámara al montar
  useEffect(() => {
    startCamera();
    
    // Limpiar al desmontar
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4 rounded-xl overflow-hidden border-2 border-green-500 bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-md"
          style={{ display: captureComplete ? 'none' : 'block' }}
        />
        
        {isCapturing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-6xl font-bold">
            {processing ? (
              <Loader2 className="w-16 h-16 animate-spin text-green-500" />
            ) : (
              <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-green-500 text-green-500">
                {captureComplete ? <Check className="w-10 h-10" /> : '3'}
              </div>
            )}
          </div>
        )}
        
        {captureComplete && (
          <div className="flex items-center justify-center h-[300px] bg-black">
            <div className="flex flex-col items-center justify-center text-green-500">
              <Check className="w-16 h-16 mb-2" />
              <p className="text-xl font-semibold">Verificación Exitosa</p>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      
      <Button
        onClick={captureImage}
        disabled={isCapturing || captureComplete || !cameraActive}
        className="bg-green-500 hover:bg-green-600 text-black font-bold"
      >
        {isCapturing ? 'Capturando...' : 'Iniciar Verificación Facial'}
      </Button>
    </div>
  );
};

// Página principal de autenticación móvil
const MobileAuth = () => {
  const [location] = useLocation();
  const sessionId = new URLSearchParams(location.split('?')[1]).get('session') || '';
  const [step, setStep] = useState<'initial' | 'face-scan' | 'complete'>('initial');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Manejar autenticación exitosa
  const handleAuthSuccess = async () => {
    try {
      await fetch('/api/superadmin/authenticate-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      
      setStep('complete');
      
      toast({
        title: 'Autenticación Exitosa',
        description: 'Has sido autenticada como Super Admin.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error finalizando autenticación:', error);
      setError('Error completando el proceso de autenticación. Por favor, intenta de nuevo.');
    }
  };

  // Manejar error de autenticación
  const handleAuthError = (message: string) => {
    setError(message);
    toast({
      title: 'Error de Autenticación',
      description: message,
      variant: 'destructive',
    });
  };

  // Si no hay sessionId, mostrar error
  if (!sessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black p-4">
        <Card className="w-full max-w-md border-red-500 bg-black text-white">
          <CardHeader>
            <CardTitle className="text-xl text-red-500">Error de Autenticación</CardTitle>
            <CardDescription className="text-gray-400">
              No se proporcionó un ID de sesión válido. Por favor, escanea un código QR válido.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <Card className="w-full max-w-md border-green-500 bg-black text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-500">
            {step === 'initial' && 'Autenticación Super Admin'}
            {step === 'face-scan' && 'Verificación Facial'}
            {step === 'complete' && 'Autenticación Completa'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {step === 'initial' && 'Para acceder como Super Admin, debes realizar una verificación biométrica'}
            {step === 'face-scan' && 'Posiciona tu rostro dentro del marco y permanece quieta'}
            {step === 'complete' && 'Has sido autenticada correctamente. Ya puedes cerrar esta ventana.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 'initial' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <Video className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-center text-gray-400">
                Para continuar con la autenticación, necesitamos verificar tu identidad mediante reconocimiento facial.
                Asegúrate de estar en un lugar con buena iluminación y que tu rostro sea claramente visible.
              </p>
            </div>
          )}
          
          {step === 'face-scan' && (
            <FaceRecognition 
              sessionId={sessionId} 
              onSuccess={handleAuthSuccess} 
              onError={handleAuthError} 
            />
          )}
          
          {step === 'complete' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-center text-gray-400">
                Autenticación biométrica completada con éxito. El acceso como Super Admin ha sido concedido
                en el dispositivo desde donde se generó el código QR.
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-950/50 border border-red-500 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-100">{error}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {step === 'initial' && (
            <Button 
              onClick={() => setStep('face-scan')} 
              className="bg-green-500 hover:bg-green-600 text-black font-bold"
            >
              Comenzar Verificación
            </Button>
          )}
          
          {step === 'complete' && (
            <p className="text-xs text-center text-gray-400">
              Esta ventana se puede cerrar de forma segura.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MobileAuth;