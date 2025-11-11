'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full mb-10"
    >
      {/* Banner del evento */}
      <div className="relative w-full h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-3xl overflow-hidden shadow-2xl mb-8 ring-4 ring-[#2b54bf]/20">
        <Image
          src="/banner-event.jpeg"
          alt="Feria Empresarial 2025"
          fill
          className="object-cover object-top scale-105 hover:scale-100 transition-transform duration-500"
          priority
        />
      </div>

      {/* Título y descripción */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-[#2b54bf] to-[#fed113]">
            Feria Empresarial 2025
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 font-semibold">
          Registro de Asistentes
        </p>
        
        <div className="mt-6 h-1.5 w-40 bg-linear-to-r from-[#2b54bf] to-[#fed113] mx-auto rounded-full shadow-lg" />
      </motion.div>
    </motion.div>
  );
}
