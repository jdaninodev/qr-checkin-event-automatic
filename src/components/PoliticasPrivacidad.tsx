'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface PoliticasPrivacidadProps {
  aceptado: boolean;
  onChange: (value: boolean) => void;
}

export default function PoliticasPrivacidad({ aceptado, onChange }: PoliticasPrivacidadProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-[#2b54bf]/20">
        <ShieldCheck className="w-6 h-6 text-[#2b54bf]" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Declaración de Datos
        </h2>
      </div>

      <div className="bg-linear-to-br from-[#2b54bf]/5 to-[#fed113]/5 p-6 rounded-xl border-2 border-[#2b54bf]/20 shadow-md">
        <p className="text-sm text-gray-700 leading-relaxed">
          Al registrarme en la <strong>Feria Empresarial 2025</strong>, autorizo el tratamiento de mis datos personales 
          de acuerdo con la política de privacidad y protección de datos personales. Los datos serán 
          utilizados únicamente para fines relacionados con el evento y su gestión.
        </p>
      </div>

      <motion.label
        whileHover={{ x: 5 }}
        transition={{ duration: 0.1 }}
        className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            required
            checked={aceptado}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 rounded focus:ring-[#2b54bf] cursor-pointer"
            style={{ accentColor: '#2b54bf' }}
          />
          {aceptado && (
            <div className="absolute -top-1 -right-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" fill="currentColor" />
            </div>
          )}
        </div>
        <span className="text-sm text-gray-700 group-hover:text-[#2b54bf] transition-colors">
          Acepto la política de privacidad y el tratamiento de mis datos personales{' '}
          <span className="text-[#2b54bf] font-bold">*</span>
        </span>
      </motion.label>
    </section>
  );
}
