import { Link, useLocation } from "wouter";
import { Activity, BarChart, Calendar, Home, User } from "lucide-react";

/**
 * Navegación móvil para la aplicación Fitness AI.
 * Este componente aparece en la parte inferior de la pantalla en dispositivos móviles.
 */
const MobileNavigation = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    {
      name: "Inicio",
      path: "/",
      icon: Home,
    },
    {
      name: "Workouts",
      path: "/workout-library",
      icon: Activity,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: BarChart,
    },
    {
      name: "Calendario",
      path: "/calendar",
      icon: Calendar,
    },
    {
      name: "Perfil",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="md:hidden app-fixed-bottom app-safe-area-bottom">
      <nav className="app-footer-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`app-nav-item ${
              isActive(item.path) 
                ? "text-green-500" 
                : "text-gray-400 hover:text-green-400"
            }`}
          >
            <item.icon className={isActive(item.path) ? "text-green-500" : "text-gray-400"} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigation;