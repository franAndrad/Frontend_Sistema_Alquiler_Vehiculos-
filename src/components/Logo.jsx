import './Logo.css';

function Logo({ size = 'medium' }) {
  const sizeMap = {
    small: { width: 32, height: 32, fontSize: '14px' },
    medium: { width: 48, height: 48, fontSize: '20px' },
    large: { width: 64, height: 64, fontSize: '28px' }
  };

  const dimensions = sizeMap[size] || sizeMap.medium;

  return (
    <div className="logo-container" style={{ fontSize: dimensions.fontSize }}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 64 64"
        className="logo-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fondo circular sutil para la flecha */}
        <circle cx="32" cy="16" r="14" fill="#3b82f6" opacity="0.1" />
        
        {/* Flecha circular azul brillante - diseño mejorado */}
        <path
          d="M 32 4 A 12 12 0 0 1 50 14"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Punta de flecha mejorada */}
        <path
          d="M 46 10 L 50 14 L 46 18"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Checkmark verde con fondo circular */}
        <circle cx="32" cy="16" r="7" fill="#22c55e" opacity="0.2" />
        <path
          d="M 29 16 L 31.5 18.5 L 35 13"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Silueta del auto mejorada y más detallada */}
        <path
          d="M 18 38 L 16 42 L 16 48 L 18 50 L 22 50 L 24 48 L 40 48 L 42 50 L 46 50 L 48 48 L 48 42 L 46 38 L 44 36 L 20 36 Z"
          fill="#334155"
        />
        {/* Parabrisas con más detalle */}
        <path
          d="M 22 38 L 24 36 L 28 36 L 30 38 L 30 40 L 28 42 L 24 42 Z"
          fill="#475569"
          opacity="0.7"
        />
        <path
          d="M 34 38 L 36 36 L 40 36 L 42 38 L 42 40 L 40 42 L 36 42 Z"
          fill="#475569"
          opacity="0.7"
        />
        {/* Línea divisoria del parabrisas */}
        <line x1="32" y1="36" x2="32" y2="42" stroke="#64748b" strokeWidth="1.5" opacity="0.6" />
        {/* Faros mejorados con brillo */}
        <circle cx="24" cy="42" r="3" fill="#fbbf24" opacity="0.9" />
        <circle cx="40" cy="42" r="3" fill="#fbbf24" opacity="0.9" />
        <circle cx="24" cy="42" r="2" fill="#fef3c7" opacity="0.8" />
        <circle cx="40" cy="42" r="2" fill="#fef3c7" opacity="0.8" />
        {/* Ruedas más detalladas con sombra */}
        <circle cx="22" cy="50" r="4.5" fill="#1e293b" />
        <circle cx="42" cy="50" r="4.5" fill="#1e293b" />
        <circle cx="22" cy="50" r="3" fill="#475569" />
        <circle cx="42" cy="50" r="3" fill="#475569" />
        {/* Centro de las ruedas */}
        <circle cx="22" cy="50" r="1.5" fill="#64748b" />
        <circle cx="42" cy="50" r="1.5" fill="#64748b" />
        {/* Líneas de la carrocería */}
        <line x1="20" y1="40" x2="44" y2="40" stroke="#475569" strokeWidth="1" opacity="0.5" />
      </svg>
      <div className="logo-text">
        <span className="logo-text-auto">Auto</span>
        <span className="logo-text-track">Track</span>
      </div>
    </div>
  );
}

export default Logo;
