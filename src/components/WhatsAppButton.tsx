import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const whatsappUrl = "https://wa.me/243845294616?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20vos%20cr%C3%A9ations%20sur%20Atelier%20Kalu.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactez-nous sur WhatsApp (0845294616)"
      title="Contactez-nous sur WhatsApp (0845294616)"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-full shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group border border-emerald-400/30"
    >
      <div className="relative flex items-center justify-center">
        {/* Animated Pulse Ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
        
        {/* WhatsApp Icon */}
        <svg
          className="w-5 h-5 fill-current relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.989 9.984 0 1.758.459 3.474 1.33 4.982l-1.413 5.161 5.283-1.386c1.453.792 3.092 1.22 4.789 1.22 5.505 0 9.988-4.478 9.988-9.985 0-5.506-4.483-9.976-9.988-9.976zm5.836 14.129c-.247.691-1.223 1.321-1.987 1.487-.525.114-1.209.206-3.525-.752-2.962-1.225-4.871-4.24-5.018-4.436-.147-.196-1.2-1.597-1.2-3.047 0-1.45.76-2.164 1.03-2.458.27-.294.588-.368.784-.368.196 0 .392.002.564.01.184.009.431-.07.674.515.245.588.833 2.035.907 2.182.073.147.122.319.024.515-.098.196-.147.319-.294.49-.147.172-.309.383-.441.515-.147.147-.301.307-.129.602.172.295.766 1.265 1.644 2.048 1.129.006 2.083.663 2.378.81.294.147.466.122.637-.074.172-.196.735-.858.932-1.152.196-.294.392-.245.662-.147.27.098 1.716.81 2.01 1.055.294.245.294.417.221.711z" />
        </svg>
      </div>

      <span className="font-semibold tracking-wide whitespace-nowrap">
        Contactez-nous sur WhatsApp
      </span>
    </a>
  );
};
