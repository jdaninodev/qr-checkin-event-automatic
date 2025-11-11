'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface JornadaSelectorProps {
  jornadas: string[];
  selectedJornadas: string[];
  onChange: (jornada: string) => void;
}

export default function JornadaSelector({ jornadas, selectedJornadas, onChange }: JornadaSelectorProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
        <Calendar className="w-4 h-4 text-[#2b54bf]" />
        Jornada de asistencia *
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {jornadas.map((jornada) => (
          <motion.label
            key={jornada}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
            className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md"
            style={{
              borderColor: selectedJornadas.includes(jornada) ? '#2b54bf' : '#e5e7eb',
              backgroundColor: selectedJornadas.includes(jornada) ? '#eff3ff' : 'transparent',
            }}
          >
            <input
              type="checkbox"
              checked={selectedJornadas.includes(jornada)}
              onChange={() => onChange(jornada)}
              className="w-4 h-4 rounded focus:ring-[#2b54bf]"
              style={{
                accentColor: '#2b54bf'
              }}
            />
            <span className="text-sm text-gray-700 font-medium">{jornada}</span>
          </motion.label>
        ))}
      </div>
    </div>
  );
}
