'use client';

import { motion } from 'framer-motion';

interface TipoAsistenteSelectorProps {
  tipos: string[];
  selected: string;
  onChange: (tipo: string) => void;
}

const iconColors: Record<string, string> = {
  'Estudiante': 'from-[#2b54bf] to-[#3d68d4]',
  'Acudiente / Padre de familia': 'from-[#fed113] to-[#ffd700]',
  'Docente': 'from-[#2b54bf] to-[#fed113]',
  'Directivos': 'from-[#2b54bf] to-[#3d68d4]',
  'Administrativos': 'from-[#fed113] to-[#ffd700]',
  'Invitado': 'from-gray-500 to-slate-500',
};

export default function TipoAsistenteSelector({ tipos, selected, onChange }: TipoAsistenteSelectorProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
        Tipo de Asistente <span className="text-[#2b54bf]">*</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tipos.map((tipo) => (
          <motion.label
            key={tipo}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
            className="relative flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all overflow-hidden group"
            style={{
              borderColor: selected === tipo ? '#2b54bf' : '#e5e7eb',
              backgroundColor: selected === tipo ? '#eff3ff' : 'white',
            }}
          >
            {/* Efecto de fondo animado */}
            <div
              className={`absolute inset-0 bg-linear-to-br ${iconColors[tipo]} opacity-0 group-hover:opacity-10 transition-opacity duration-200`}
            />
            
            {/* Radio button personalizado */}
            <div className="relative">
              <input
                type="radio"
                name="tipoAsistente"
                value={tipo}
                checked={selected === tipo}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                  selected === tipo 
                    ? 'border-[#2b54bf] bg-[#2b54bf]' 
                    : 'border-gray-300'
                }`}
              >
                {selected === tipo && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
            
            <span className="text-sm text-center text-gray-700 font-medium relative z-10">
              {tipo}
            </span>
          </motion.label>
        ))}
      </div>
    </div>
  );
}
