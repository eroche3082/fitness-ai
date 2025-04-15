import React from 'react';
import { FitnessConfig } from '../../services/fitnessConfigService';
import { Activity, Check, ArrowRight } from 'lucide-react';

interface PreviewPanelProps {
  config: FitnessConfig;
  previewMode: 'desktop' | 'mobile' | 'tablet';
}

export default function PreviewPanel({ config, previewMode }: PreviewPanelProps) {
  // Aplicar estilos dinámicos basados en la configuración
  const buttonStyle = {
    backgroundColor: config.primary_color,
    color: '#000000',
    padding: '0.5rem 1rem',
    borderRadius: 
      config.button_shape === 'rounded' ? '0.375rem' : 
      config.button_shape === 'pill' ? '9999px' : 
      '0',
    fontFamily: config.font_family,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 'bold',
  };
  
  const headingStyle = {
    fontFamily: config.font_family,
    color: '#ffffff',
    marginBottom: '0.5rem',
  };
  
  const subheadingStyle = {
    fontFamily: config.font_family,
    color: '#9ca3af',
    marginBottom: '1rem',
  };

  return (
    <div 
      className="w-full overflow-hidden"
      style={{ 
        backgroundColor: config.layout === 'dark' ? '#000000' : '#ffffff',
        color: config.layout === 'dark' ? '#ffffff' : '#000000',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center">
          <Activity className="h-5 w-5 mr-2" style={{ color: config.primary_color }} />
          <h2 className="text-lg font-bold" style={{ fontFamily: config.font_family }}>
            FITNESS<span style={{ color: config.primary_color }}>AI</span>
          </h2>
        </div>
        <div className="hidden md:flex space-x-4">
          {config.header_menu.map((item, index) => (
            <a 
              key={index} 
              href="#" 
              className="text-sm hover:text-opacity-80"
              style={{ color: config.layout === 'dark' ? '#ffffff' : '#000000', fontFamily: config.font_family }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[200px] flex items-center p-4 overflow-hidden">
        {config.hero_image_url && (
          <div 
            className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${config.hero_image_url})`,
              filter: 'brightness(0.5)'
            }}
          />
        )}
        <div className="relative z-10 max-w-full">
          <h1 
            className="text-2xl md:text-3xl font-bold" 
            style={headingStyle}
          >
            {config.homepage_title}
          </h1>
          <p 
            className="text-sm md:text-base" 
            style={subheadingStyle}
          >
            {config.homepage_subtitle}
          </p>
          <button style={buttonStyle}>
            {config.cta_text}
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Features Section Placeholder */}
      {config.visible_sections.features && (
        <div className="p-4 border-t border-gray-800">
          <h2 
            className="text-xl font-semibold mb-3" 
            style={headingStyle}
          >
            Características
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="flex items-start p-2 bg-opacity-10" style={{ backgroundColor: config.layout === 'dark' ? '#1f2937' : '#f3f4f6' }}>
                <Check className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" style={{ color: config.primary_color }} />
                <span className="text-xs" style={{ fontFamily: config.font_family }}>
                  Característica {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Section Placeholder */}
      {config.visible_sections.pricing && (
        <div className="p-4 border-t border-gray-800">
          <h2 
            className="text-xl font-semibold mb-3" 
            style={headingStyle}
          >
            Precios
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {['Básico', 'Premium'].map(plan => (
              <div 
                key={plan} 
                className="p-2 rounded-sm text-center"
                style={{ 
                  backgroundColor: config.layout === 'dark' ? '#1f2937' : '#f3f4f6',
                  fontFamily: config.font_family,
                  border: `1px solid ${config.primary_color}`
                }}
              >
                <div className="font-semibold" style={{ color: config.primary_color }}>{plan}</div>
                <div className="text-xs mt-1">Desde $9.99/mes</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plans Section Placeholder */}
      {config.visible_sections.plans && (
        <div className="p-4 border-t border-gray-800">
          <h2 
            className="text-xl font-semibold mb-3" 
            style={headingStyle}
          >
            Planes
          </h2>
          <div 
            className="p-2 text-xs"
            style={{ 
              backgroundColor: config.layout === 'dark' ? '#1f2937' : '#f3f4f6',
              fontFamily: config.font_family
            }}
          >
            Contenido de los planes de entrenamiento
          </div>
        </div>
      )}

      {/* Chat Widget Placeholder */}
      {config.visible_sections.chat && (
        <div className="absolute bottom-4 right-4">
          <div 
            className="rounded-full h-10 w-10 flex items-center justify-center"
            style={{ backgroundColor: config.primary_color }}
          >
            <span 
              className="text-sm font-bold"
              style={{ color: config.layout === 'dark' ? '#000000' : '#ffffff' }}
            >
              AI
            </span>
          </div>
        </div>
      )}
    </div>
  );
}