'use client';

import { motion } from 'framer-motion';
import { Shield, Facebook } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-[#2b54bf]/10 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo ATC y nombre del evento */}
          <div className="flex items-center gap-3">
            {/* Logo ATC */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src="/logo-atc.jpeg"
                  alt="Logo ATC"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-[#2b54bf] to-[#fed113]">
                  Feria Empresarial 2025
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Sistema de Registro</p>
              </div>
            </Link>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-3">
            {/* Botón Facebook */}
            <motion.a
              href="https://www.facebook.com/profile.php?id=100068924903045"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              aria-label="Página de Facebook - Feria Empresarial 2025"
              className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:bg-[#1565c0] transition-colors shadow-md"
            >
              <Facebook className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Síguenos</span>
            </motion.a>

            {/* Botón Panel Admin */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#2b54bf] to-[#fed113] text-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <Shield className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Panel Admin</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
