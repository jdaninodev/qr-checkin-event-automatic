'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, LogOut, Users, Calendar, FileText, QrCode, Download, BarChart3, Settings, Database, Mail, FileType, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Verificar si ya está autenticado al cargar
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Pass#753') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setError('');
      setPassword('');
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setPassword('');
  };

  // Pantalla de Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#2b54bf]/10 via-[#fed113]/10 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-[#2b54bf]/20">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Logo ATC */}
              <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                <Image
                  src="/logo-atc.jpeg"
                  alt="Logo ATC"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-[#2b54bf] to-[#fed113] mb-2">
                Panel de Administrador
              </h1>
              <p className="text-gray-600">Feria Empresarial 2025</p>
            </div>

            {/* Formulario de Login */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 text-[#2b54bf]" />
                  Contraseña de Acceso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa la contraseña"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2b54bf] focus:border-[#2b54bf] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2b54bf] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-sm mt-2 flex items-center gap-1"
                    >
                      ⚠️ {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-linear-to-r from-[#2b54bf] to-[#fed113] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Iniciar Sesión
              </motion.button>
            </form>

            {/* Volver al inicio */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-[#2b54bf] hover:underline"
              >
                ← Volver al formulario de registro
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard (después de autenticar)
  return (
    <div className="min-h-screen bg-linear-to-br from-[#2b54bf]/5 via-[#fed113]/5 to-white">
      {/* Navbar del Admin */}
      <nav className="bg-white border-b-2 border-[#2b54bf]/10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo ATC */}
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/logo-atc.jpeg"
                  alt="Logo ATC"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-[#2b54bf] to-[#fed113]">
                  Panel de Administrador
                </h1>
                <p className="text-xs text-gray-500">Feria Empresarial 2025</p>
              </div>
            </div>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Contenido del Dashboard */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-8 h-8" />}
            title="Total Registros"
            value="0"
            color="from-[#2b54bf] to-blue-600"
          />
          <StatCard
            icon={<Calendar className="w-8 h-8" />}
            title="Asistentes Hoy"
            value="0"
            color="from-[#fed113] to-yellow-600"
          />
          <StatCard
            icon={<QrCode className="w-8 h-8" />}
            title="QR Generados"
            value="0"
            color="from-green-500 to-green-600"
          />
          <StatCard
            icon={<FileText className="w-8 h-8" />}
            title="Tickets PDF"
            value="0"
            color="from-purple-500 to-purple-600"
          />
        </div>

        {/* Secciones del Dashboard */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Lista de Asistentes - Ancho completo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-5 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2b54bf]/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#2b54bf]" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Registros Recientes</h2>
            </div>
            <div className="text-center py-10 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No hay registros aún</p>
              <p className="text-sm mt-1">Los asistentes registrados aparecerán aquí</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Escáner QR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-5 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Escáner QR</h2>
            </div>
            <div className="text-center py-8 text-gray-500">
              <QrCode className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium text-sm">Escanea códigos QR</p>
              <p className="text-xs mt-1 mb-4">Registra asistencia al evento</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-md text-sm"
              >
                <span className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Activar Escáner
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Reportes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-5 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Reportes</h2>
            </div>
            <div className="space-y-2">
              <ReportButton title="Exportar a CSV" icon={<Download className="w-4 h-4" />} />
              <ReportButton title="Reporte de Asistencia" icon={<FileText className="w-4 h-4" />} />
              <ReportButton title="Stats por Jornada" icon={<Clock className="w-4 h-4" />} />
              <ReportButton title="Por Tipo de Asistente" icon={<Users className="w-4 h-4" />} />
            </div>
          </motion.div>
        </div>

        {/* Configuración - Ancho completo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-5 border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#fed113]/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#fed113]" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Configuración del Sistema</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ConfigButton title="Jornadas" icon={<Calendar className="w-4 h-4" />} />
            <ConfigButton title="Email" icon={<Mail className="w-4 h-4" />} />
            <ConfigButton title="Plantillas PDF" icon={<FileType className="w-4 h-4" />} />
            <ConfigButton title="Base de Datos" icon={<Database className="w-4 h-4" />} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Componente de Tarjeta de Estadística
function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
    >
      <div className={`w-12 h-12 bg-linear-to-r ${color} rounded-lg flex items-center justify-center text-white mb-3 shadow-sm`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-xs font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </motion.div>
  );
}

// Componente de Botón de Reporte
function ReportButton({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left px-3 py-2.5 bg-gray-50 hover:bg-purple-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-all"
    >
      <div className="flex items-center gap-2">
        <div className="text-purple-600">{icon}</div>
        <span className="text-gray-700 font-medium text-sm">{title}</span>
      </div>
    </motion.button>
  );
}

// Componente de Botón de Configuración
function ConfigButton({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="w-full px-4 py-3 bg-linear-to-br from-[#fed113]/5 to-[#fed113]/10 hover:from-[#fed113]/10 hover:to-[#fed113]/20 rounded-lg border border-[#fed113]/30 hover:border-[#fed113]/50 transition-all"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-[#fed113]">{icon}</div>
        <span className="text-gray-700 font-medium text-sm">{title}</span>
      </div>
    </motion.button>
  );
}
