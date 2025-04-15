import React from 'react';
import { FitnessConfig } from '../../services/fitnessConfigService';

interface PreviewPanelProps {
  config: FitnessConfig;
  previewMode: 'desktop' | 'mobile' | 'tablet';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ config, previewMode }) => {
  // Helper para generar estilos de botones basados en la configuración
  const getButtonStyles = () => {
    let borderRadius = '0.375rem';  // rounded por defecto
    
    if (config.button_shape === 'squared') {
      borderRadius = '0';
    } else if (config.button_shape === 'pill') {
      borderRadius = '9999px';
    }
    
    return {
      backgroundColor: config.primary_color,
      borderRadius,
      padding: previewMode === 'mobile' ? '0.5rem 1rem' : '0.75rem 1.5rem',
      fontSize: previewMode === 'mobile' ? '0.875rem' : '1rem',
      fontWeight: 'bold',
      color: '#ffffff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease-in-out',
      border: 'none',
      cursor: 'pointer',
    };
  };

  // Obtener tamaño de texto responsivo
  const getResponsiveTextSize = (size: 'h1' | 'h2' | 'p') => {
    switch (size) {
      case 'h1':
        return previewMode === 'mobile' ? '1.75rem' : previewMode === 'tablet' ? '2.25rem' : '3rem';
      case 'h2':
        return previewMode === 'mobile' ? '1.25rem' : previewMode === 'tablet' ? '1.5rem' : '1.75rem';
      case 'p':
        return previewMode === 'mobile' ? '0.875rem' : '1rem';
    }
  };

  // Aplicar tema global (claro/oscuro)
  const themeStyles = {
    backgroundColor: config.layout === 'dark' ? '#000000' : '#ffffff',
    color: config.layout === 'dark' ? '#ffffff' : '#333333',
  };

  return (
    <div 
      style={{
        ...themeStyles,
        fontFamily: config.font_family,
        borderRadius: '0.5rem',
        overflow: 'hidden',
        minHeight: previewMode === 'mobile' ? '480px' : '640px',
      }}
      className="shadow-lg border border-gray-800"
    >
      {/* Header */}
      <header 
        style={{ 
          padding: previewMode === 'mobile' ? '1rem' : '1.5rem',
          backgroundColor: config.layout === 'dark' ? '#111111' : '#f5f5f5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${config.layout === 'dark' ? '#222222' : '#e5e5e5'}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 
            style={{ 
              fontSize: previewMode === 'mobile' ? '1.25rem' : '1.5rem',
              fontWeight: 'bold',
              color: config.primary_color
            }}
          >
            Fitness AI
          </h1>
        </div>
        
        <nav>
          <ul style={{ display: 'flex', gap: previewMode === 'mobile' ? '0.5rem' : '1rem' }}>
            {config.header_menu.slice(0, previewMode === 'mobile' ? 3 : 5).map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  onClick={(e) => e.preventDefault()}
                  style={{ 
                    color: config.layout === 'dark' ? '#e5e5e5' : '#333333',
                    fontSize: previewMode === 'mobile' ? '0.75rem' : '0.875rem',
                    textDecoration: 'none'
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Hero section */}
      <section 
        style={{ 
          padding: previewMode === 'mobile' ? '2rem 1rem' : '4rem 2rem',
          textAlign: 'center',
          backgroundImage: config.hero_image_url ? `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${config.hero_image_url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: config.layout === 'dark' ? '#111111' : '#f5f5f5',
        }}
      >
        <h1 
          style={{ 
            fontSize: getResponsiveTextSize('h1'),
            fontWeight: 'bold',
            marginBottom: previewMode === 'mobile' ? '0.75rem' : '1rem',
            color: config.hero_image_url ? '#ffffff' : (config.layout === 'dark' ? '#ffffff' : '#333333'),
          }}
        >
          {config.homepage_title}
        </h1>
        
        <p 
          style={{ 
            fontSize: getResponsiveTextSize('p'),
            maxWidth: '800px',
            margin: '0 auto',
            marginBottom: previewMode === 'mobile' ? '1.5rem' : '2rem',
            color: config.hero_image_url ? '#ffffff' : (config.layout === 'dark' ? '#e5e5e5' : '#666666'),
          }}
        >
          {config.homepage_subtitle}
        </p>
        
        <button style={getButtonStyles()}>
          {config.cta_text}
        </button>
      </section>

      {/* Features section */}
      {config.visible_sections.features && (
        <section 
          style={{ 
            padding: previewMode === 'mobile' ? '2rem 1rem' : '4rem 2rem',
            backgroundColor: config.layout === 'dark' ? '#0a0a0a' : '#ffffff',
            borderTop: `1px solid ${config.layout === 'dark' ? '#222222' : '#e5e5e5'}`
          }}
        >
          <h2 
            style={{ 
              fontSize: getResponsiveTextSize('h2'),
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: previewMode === 'mobile' ? '1.5rem' : '2.5rem',
            }}
          >
            Características
          </h2>
          
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: previewMode === 'mobile' ? '1fr' : previewMode === 'tablet' ? '1fr 1fr' : '1fr 1fr 1fr',
              gap: '1.5rem',
            }}
          >
            {[
              'Entrenamiento IA Personalizado',
              'Seguimiento de Progreso',
              'Análisis Biométrico',
              'Rutinas Adaptativas',
              'Comunidad de Fitness',
              'Asistente de Voz',
            ].slice(0, previewMode === 'mobile' ? 3 : 6).map((feature, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: config.layout === 'dark' ? '#111111' : '#f5f5f5',
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
              >
                <h3 
                  style={{ 
                    fontSize: previewMode === 'mobile' ? '1.125rem' : '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                    color: config.primary_color,
                  }}
                >
                  {feature}
                </h3>
                <p 
                  style={{ 
                    fontSize: previewMode === 'mobile' ? '0.875rem' : '1rem',
                    color: config.layout === 'dark' ? '#e5e5e5' : '#666666',
                  }}
                >
                  Descripción de {feature.toLowerCase()}. Aquí se explicaría cómo esta característica beneficia al usuario.
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pricing section */}
      {config.visible_sections.pricing && (
        <section 
          style={{ 
            padding: previewMode === 'mobile' ? '2rem 1rem' : '4rem 2rem',
            backgroundColor: config.layout === 'dark' ? '#111111' : '#f5f5f5',
            borderTop: `1px solid ${config.layout === 'dark' ? '#222222' : '#e5e5e5'}`
          }}
        >
          <h2 
            style={{ 
              fontSize: getResponsiveTextSize('h2'),
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: previewMode === 'mobile' ? '1rem' : '1.5rem',
            }}
          >
            Planes y Precios
          </h2>
          
          <p 
            style={{ 
              fontSize: getResponsiveTextSize('p'),
              textAlign: 'center',
              maxWidth: '700px',
              margin: '0 auto',
              marginBottom: previewMode === 'mobile' ? '1.5rem' : '2.5rem',
              color: config.layout === 'dark' ? '#e5e5e5' : '#666666',
            }}
          >
            Elige el plan que mejor se adapte a tus necesidades de entrenamiento y objetivos de fitness.
          </p>
          
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: previewMode === 'mobile' ? '1fr' : previewMode === 'tablet' ? '1fr 1fr' : '1fr 1fr 1fr',
              gap: '1.5rem',
            }}
          >
            {[
              { name: 'Básico', price: '9.99', features: ['Entrenamientos básicos', 'Seguimiento limitado', 'Soporte por email'] },
              { name: 'Premium', price: '19.99', features: ['Todos los entrenamientos', 'Análisis avanzado', 'Seguimiento ilimitado', 'Soporte prioritario'] },
              { name: 'Elite', price: '29.99', features: ['Entrenador IA dedicado', 'Análisis en tiempo real', 'Videoconferencias', 'Soporte 24/7', 'Plan nutricional'] },
            ].slice(0, previewMode === 'mobile' ? 2 : 3).map((plan, index) => (
              <div 
                key={index}
                style={{ 
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: config.layout === 'dark' ? '#0a0a0a' : '#ffffff',
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
                  border: `1px solid ${config.layout === 'dark' ? '#222222' : '#e5e5e5'}`,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h3 
                  style={{ 
                    fontSize: previewMode === 'mobile' ? '1.25rem' : '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                    color: config.primary_color,
                  }}
                >
                  {plan.name}
                </h3>
                
                <div style={{ margin: '1rem 0' }}>
                  <span 
                    style={{ 
                      fontSize: previewMode === 'mobile' ? '1.5rem' : '2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    ${plan.price}
                  </span>
                  <span style={{ color: config.layout === 'dark' ? '#999999' : '#666666' }}>/mes</span>
                </div>
                
                <ul style={{ margin: '1rem 0', flexGrow: 1 }}>
                  {plan.features.map((feature, idx) => (
                    <li 
                      key={idx}
                      style={{ 
                        marginBottom: '0.5rem', 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: previewMode === 'mobile' ? '0.875rem' : '1rem',
                      }}
                    >
                      <span style={{ color: config.primary_color }}>✓</span> {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  style={{
                    ...getButtonStyles(),
                    width: '100%', 
                    marginTop: '1rem',
                  }}
                >
                  Seleccionar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Chatbot Section */}
      {config.visible_sections.chat && (
        <div 
          style={{ 
            position: 'fixed', 
            bottom: '20px', 
            right: '20px',
            zIndex: 50 
          }}
        >
          <button
            style={{
              backgroundColor: config.primary_color,
              color: '#ffffff',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;