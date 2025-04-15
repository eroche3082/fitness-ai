import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard,
  Award,
  Check,
  X,
  Edit,
  Trash2,
  AlertTriangle,
  PlusCircle,
  Settings,
  ToggleRight,
  Lock
} from 'lucide-react';

// Tipos de plan
type PlanType = 'basic' | 'premium' | 'vip' | 'elite';

interface Feature {
  id: string;
  name: string;
  included: boolean;
}

interface PlanFeatures {
  [key: string]: Feature[];
}

interface Plan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  interval: 'monthly' | 'yearly';
  description: string;
  isPublic: boolean;
  isPopular: boolean;
}

// Datos de muestra
const samplePlans: Plan[] = [
  {
    id: '1',
    name: 'Plan Básico',
    type: 'basic',
    price: 9.99,
    interval: 'monthly',
    description: 'Para los que están comenzando su viaje fitness',
    isPublic: true,
    isPopular: false
  },
  {
    id: '2',
    name: 'Plan Premium',
    type: 'premium',
    price: 19.99,
    interval: 'monthly',
    description: 'Para entusiastas que quieren resultados mejores',
    isPublic: true,
    isPopular: true
  },
  {
    id: '3',
    name: 'Plan VIP',
    type: 'vip',
    price: 39.99,
    interval: 'monthly',
    description: 'Para atletas serios que buscan lo mejor',
    isPublic: true,
    isPopular: false
  },
  {
    id: '4',
    name: 'Plan Elite',
    type: 'elite',
    price: 299.99,
    interval: 'yearly',
    description: 'Acceso exclusivo a todas las características y entrenamiento personalizado',
    isPublic: false,
    isPopular: false
  }
];

// Características de los planes
const sampleFeatures: PlanFeatures = {
  '1': [
    { id: '1-1', name: 'Rutinas básicas', included: true },
    { id: '1-2', name: 'Seguimiento de progreso', included: true },
    { id: '1-3', name: 'Chatbot de asistencia', included: true },
    { id: '1-4', name: 'Programas personalizados', included: false },
    { id: '1-5', name: 'Coach de voz', included: false },
    { id: '1-6', name: 'Análisis avanzado', included: false }
  ],
  '2': [
    { id: '2-1', name: 'Rutinas básicas', included: true },
    { id: '2-2', name: 'Seguimiento de progreso', included: true },
    { id: '2-3', name: 'Chatbot de asistencia', included: true },
    { id: '2-4', name: 'Programas personalizados', included: true },
    { id: '2-5', name: 'Coach de voz', included: true },
    { id: '2-6', name: 'Análisis avanzado', included: false }
  ],
  '3': [
    { id: '3-1', name: 'Rutinas básicas', included: true },
    { id: '3-2', name: 'Seguimiento de progreso', included: true },
    { id: '3-3', name: 'Chatbot de asistencia', included: true },
    { id: '3-4', name: 'Programas personalizados', included: true },
    { id: '3-5', name: 'Coach de voz', included: true },
    { id: '3-6', name: 'Análisis avanzado', included: true }
  ],
  '4': [
    { id: '4-1', name: 'Rutinas básicas', included: true },
    { id: '4-2', name: 'Seguimiento de progreso', included: true },
    { id: '4-3', name: 'Chatbot de asistencia', included: true },
    { id: '4-4', name: 'Programas personalizados', included: true },
    { id: '4-5', name: 'Coach de voz', included: true },
    { id: '4-6', name: 'Análisis avanzado', included: true },
    { id: '4-7', name: 'Sesiones 1-a-1 con entrenador', included: true },
    { id: '4-8', name: 'Rutinas exclusivas', included: true }
  ]
};

export default function MembershipPlansPage() {
  const { userRole } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>(samplePlans);
  const [features, setFeatures] = useState<PlanFeatures>(sampleFeatures);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedPlan, setEditedPlan] = useState<Plan | null>(null);
  
  // Función para registrar actividad administrativa
  const logAdminActivity = (activity: string) => {
    console.log(`[ADMIN LOG] ${new Date().toISOString()}: ${activity}`);
  };

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

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setEditMode(false);
    logAdminActivity(`Viewed membership plan: ${plan.name} (${plan.id})`);
  };

  const handleEditClick = () => {
    if (selectedPlan) {
      setEditedPlan({...selectedPlan});
      setEditMode(true);
      logAdminActivity(`Started editing plan: ${selectedPlan.name} (${selectedPlan.id})`);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedPlan(null);
  };

  const handleSaveEdit = () => {
    if (editedPlan) {
      const updatedPlans = plans.map(plan => 
        plan.id === editedPlan.id ? editedPlan : plan
      );
      setPlans(updatedPlans);
      setSelectedPlan(editedPlan);
      setEditMode(false);
      setEditedPlan(null);
      
      logAdminActivity(`Updated membership plan: ${editedPlan.name} (${editedPlan.id})`);
      
      toast({
        title: "Plan actualizado",
        description: `El plan ${editedPlan.name} ha sido actualizado correctamente.`,
        variant: "default"
      });
    }
  };

  const handleToggleFeature = (planId: string, featureId: string) => {
    if (userRole === 'manager') {
      const updatedFeatures = {...features};
      const planFeatures = [...updatedFeatures[planId]];
      
      const featureIndex = planFeatures.findIndex(f => f.id === featureId);
      if (featureIndex >= 0) {
        planFeatures[featureIndex] = {
          ...planFeatures[featureIndex],
          included: !planFeatures[featureIndex].included
        };
        
        updatedFeatures[planId] = planFeatures;
        setFeatures(updatedFeatures);
        
        const featureName = planFeatures[featureIndex].name;
        const planName = plans.find(p => p.id === planId)?.name || 'Unknown';
        
        logAdminActivity(`Toggle feature "${featureName}" to ${planFeatures[featureIndex].included ? 'included' : 'excluded'} for plan: ${planName}`);
        
        toast({
          title: "Característica actualizada",
          description: `"${featureName}" ha sido ${planFeatures[featureIndex].included ? 'activada' : 'desactivada'} para el plan ${planName}.`,
          variant: "default"
        });
      }
    } else {
      toast({
        title: "Acción restringida",
        description: "No tienes permisos para modificar las características del plan.",
        variant: "destructive"
      });
    }
  };

  const handlePlanVisibilityToggle = (planId: string) => {
    const updatedPlans = plans.map(plan => 
      plan.id === planId ? { ...plan, isPublic: !plan.isPublic } : plan
    );
    
    setPlans(updatedPlans);
    
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      const newVisibility = !plan.isPublic;
      
      logAdminActivity(`Changed plan visibility: ${plan.name} (${plan.id}) to ${newVisibility ? 'public' : 'private'}`);
      
      toast({
        title: "Visibilidad actualizada",
        description: `El plan ${plan.name} ahora es ${newVisibility ? 'visible' : 'privado'}.`,
        variant: "default"
      });
      
      // Si el plan seleccionado es el que se modificó, actualizar también
      if (selectedPlan && selectedPlan.id === planId) {
        setSelectedPlan({...selectedPlan, isPublic: newVisibility});
      }
    }
  };

  const handlePopularToggle = (planId: string) => {
    // Solo un plan puede ser popular
    const updatedPlans = plans.map(plan => 
      plan.id === planId 
        ? { ...plan, isPopular: true } 
        : { ...plan, isPopular: false }
    );
    
    setPlans(updatedPlans);
    
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      logAdminActivity(`Set popular plan: ${plan.name} (${plan.id})`);
      
      toast({
        title: "Plan destacado actualizado",
        description: `${plan.name} ahora es el plan destacado.`,
        variant: "default"
      });
      
      // Si el plan seleccionado es el que se modificó, actualizar también
      if (selectedPlan && selectedPlan.id === planId) {
        setSelectedPlan({...selectedPlan, isPopular: true});
      }
    }
  };

  // Color según el tipo de plan
  const getPlanColor = (type: PlanType) => {
    switch (type) {
      case 'basic':
        return 'text-blue-500 border-blue-500 bg-blue-100';
      case 'premium':
        return 'text-purple-500 border-purple-500 bg-purple-100';
      case 'vip':
        return 'text-amber-500 border-amber-500 bg-amber-100';
      case 'elite':
        return 'text-red-500 border-red-500 bg-red-100';
    }
  };

  const getPlanTypeLabel = (type: PlanType) => {
    switch (type) {
      case 'basic':
        return 'Básico';
      case 'premium':
        return 'Premium';
      case 'vip':
        return 'VIP';
      case 'elite':
        return 'Elite';
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-green-500">Planes de Membresía</h1>
            <p className="text-gray-400 mt-1">
              Gestiona los planes de suscripción de Fitness AI
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="ml-2 border-green-500 text-green-500 hover:bg-green-900"
              onClick={() => {
                toast({
                  title: "Función limitada",
                  description: "La creación de planes requiere aprobación del Super Admin",
                  variant: "default"
                });
                logAdminActivity(`Attempted to create new plan (requires Super Admin approval)`);
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Solicitar nuevo plan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de planes */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Planes Disponibles</h2>
            <div className="space-y-4">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`bg-gray-900 border-gray-800 hover:border-green-500 transition-colors cursor-pointer ${
                    selectedPlan?.id === plan.id ? 'border-green-500' : ''
                  }`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white flex items-center">
                          {plan.name}
                          {plan.isPopular && (
                            <Badge className="ml-2 bg-green-500 text-white">Popular</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {plan.interval === 'monthly' ? 'Mensual' : 'Anual'}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getPlanColor(plan.type)}`}
                      >
                        {getPlanTypeLabel(plan.type)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-white">
                        ${plan.price}
                        <span className="text-sm font-normal text-gray-400">
                          /{plan.interval === 'monthly' ? 'mes' : 'año'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Switch 
                          checked={plan.isPublic} 
                          onCheckedChange={() => handlePlanVisibilityToggle(plan.id)}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-400">
                          {plan.isPublic ? 'Público' : 'Privado'}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      {plan.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Detalles del plan */}
          <div className="lg:col-span-2">
            {selectedPlan ? (
              <Card className="bg-gray-900 border-gray-800 shadow-md">
                <CardHeader className="bg-gray-950 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white flex items-center">
                        {editMode ? (
                          <Input
                            value={editedPlan?.name || ''}
                            onChange={(e) => editedPlan && setEditedPlan({...editedPlan, name: e.target.value})}
                            className="bg-gray-800 border-gray-700 text-white focus:border-green-500"
                          />
                        ) : (
                          <>
                            {selectedPlan.name}
                            {selectedPlan.isPopular && (
                              <Badge className="ml-2 bg-green-500 text-white">Popular</Badge>
                            )}
                          </>
                        )}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {editMode ? (
                          <select
                            value={editedPlan?.interval || 'monthly'}
                            onChange={(e) => editedPlan && setEditedPlan({
                              ...editedPlan, 
                              interval: e.target.value as 'monthly' | 'yearly'
                            })}
                            className="mt-2 bg-gray-800 border border-gray-700 rounded text-white p-1"
                          >
                            <option value="monthly">Mensual</option>
                            <option value="yearly">Anual</option>
                          </select>
                        ) : (
                          `${selectedPlan.interval === 'monthly' ? 'Mensual' : 'Anual'}`
                        )}
                      </CardDescription>
                    </div>
                    <div>
                      {editMode ? (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-900 hover:text-white"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-green-500 text-green-500 hover:bg-green-900 hover:text-white"
                            onClick={handleSaveEdit}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Guardar
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-900 hover:text-white"
                          onClick={handleEditClick}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Información de precios */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Información de Precios</h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <Label htmlFor="price" className="text-gray-400">Precio</Label>
                          {editMode ? (
                            <div className="flex items-center mt-1">
                              <span className="text-white mr-1">$</span>
                              <Input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={editedPlan?.price || 0}
                                onChange={(e) => editedPlan && setEditedPlan({
                                  ...editedPlan, 
                                  price: parseFloat(e.target.value)
                                })}
                                className="bg-gray-800 border-gray-700 text-white focus:border-green-500"
                              />
                            </div>
                          ) : (
                            <div className="text-2xl font-bold text-white mt-1">
                              ${selectedPlan.price}
                              <span className="text-sm font-normal text-gray-400">
                                /{selectedPlan.interval === 'monthly' ? 'mes' : 'año'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <Label htmlFor="popular" className="text-gray-400">Plan Destacado</Label>
                          <div className="flex items-center mt-1">
                            <Switch 
                              id="popular"
                              checked={editMode ? editedPlan?.isPopular : selectedPlan.isPopular} 
                              onCheckedChange={() => {
                                if (editMode && editedPlan) {
                                  setEditedPlan({...editedPlan, isPopular: !editedPlan.isPopular});
                                } else {
                                  handlePopularToggle(selectedPlan.id);
                                }
                              }}
                              className="data-[state=checked]:bg-green-500"
                            />
                            <Label htmlFor="popular" className="ml-2 text-white">
                              {(editMode ? editedPlan?.isPopular : selectedPlan.isPopular) 
                                ? 'Destacado' 
                                : 'No destacado'}
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <Label htmlFor="public" className="text-gray-400">Visibilidad</Label>
                          <div className="flex items-center mt-1">
                            <Switch 
                              id="public"
                              checked={editMode ? editedPlan?.isPublic : selectedPlan.isPublic} 
                              onCheckedChange={() => {
                                if (editMode && editedPlan) {
                                  setEditedPlan({...editedPlan, isPublic: !editedPlan.isPublic});
                                } else {
                                  handlePlanVisibilityToggle(selectedPlan.id);
                                }
                              }}
                              className="data-[state=checked]:bg-green-500"
                            />
                            <Label htmlFor="public" className="ml-2 text-white">
                              {(editMode ? editedPlan?.isPublic : selectedPlan.isPublic) 
                                ? 'Público' 
                                : 'Privado'}
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Descripción */}
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-400 mb-2">Descripción</Label>
                      {editMode ? (
                        <Textarea
                          id="description"
                          value={editedPlan?.description || ''}
                          onChange={(e) => editedPlan && setEditedPlan({
                            ...editedPlan, 
                            description: e.target.value
                          })}
                          className="bg-gray-800 border-gray-700 text-white focus:border-green-500 min-h-[100px]"
                        />
                      ) : (
                        <p className="text-white">{selectedPlan.description}</p>
                      )}
                    </div>
                    
                    {/* Características del plan */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-4">Características Incluidas</h3>
                      <div className="space-y-3">
                        {features[selectedPlan.id]?.map((feature) => (
                          <div key={feature.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                            <div className="flex items-center">
                              {feature.included ? (
                                <Check className="h-5 w-5 text-green-500 mr-2" />
                              ) : (
                                <X className="h-5 w-5 text-gray-500 mr-2" />
                              )}
                              <span className={`${feature.included ? 'text-white' : 'text-gray-400'}`}>
                                {feature.name}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-8 w-8 p-0 ${feature.included ? 'text-green-500' : 'text-gray-500'}`}
                              onClick={() => handleToggleFeature(selectedPlan.id, feature.id)}
                            >
                              <ToggleRight className="h-4 w-4" />
                              <span className="sr-only">Toggle feature</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-950 border-t border-gray-800 flex justify-between">
                  <div className="text-sm text-gray-400">
                    <Badge variant="outline" className={`mr-2 ${getPlanColor(selectedPlan.type)}`}>
                      {getPlanTypeLabel(selectedPlan.type)}
                    </Badge>
                    ID: {selectedPlan.id}
                  </div>
                  
                  {/* Acción restringida para Admin Manager */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-500 border-gray-800 hover:bg-transparent cursor-not-allowed"
                    disabled={true}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    <span className="mr-1">Eliminar plan</span>
                    <span className="text-xs bg-gray-800 px-1 rounded">
                      Super Admin
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="bg-gray-900 border-gray-800 shadow-md">
                <CardContent className="p-12 text-center">
                  <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Gestión de Planes de Membresía</h3>
                  <p className="text-gray-400 mb-6">
                    Selecciona un plan de la lista para ver sus detalles y opciones de gestión
                  </p>
                  <p className="text-gray-500 text-sm">
                    Como Admin Manager, puedes modificar detalles, características y visibilidad de los planes,
                    pero no puedes eliminarlos ni crear planes sin aprobación.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}