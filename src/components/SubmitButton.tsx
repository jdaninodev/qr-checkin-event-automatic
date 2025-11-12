'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface SubmitButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export default function SubmitButton({ onClick, disabled = false }: SubmitButtonProps) {
  return (
    <div className="pt-6">
      <motion.button
        type="submit"
        onClick={onClick}
        disabled={disabled}
        className={`relative w-full font-bold py-4 px-6 rounded-xl shadow-xl overflow-hidden ${
          disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-linear-to-r from-[#2b54bf] to-[#fed113] text-white'
        }`}
        whileHover={disabled ? {} : { 
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(43, 84, 191, 0.4)"
        }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        {/* Efecto de brillo animado (solo si no está disabled) */}
        {!disabled && (
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear"
            }}
          />
        )}

        {/* Contenido del botón */}
        <span className={`relative z-10 flex items-center justify-center gap-3 ${
          disabled ? 'text-white/80' : 'text-white'
        }`}>
          <CheckCircle2 className="w-6 h-6" />
          <span className="text-lg">
            {disabled ? 'Enviando...' : 'Registrar Asistencia'}
          </span>
        </span>
      </motion.button>

      {/* Texto informativo */}
      <p className="text-center text-sm text-gray-500 mt-4">
        Al enviar, recibirás un ticket con código QR en tu correo electrónico
      </p>
    </div>
  );
}
