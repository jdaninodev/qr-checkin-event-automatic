'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import QRScanner from '@/components/QRScanner';
import { registrarCheckin, getCurrentSession, logoutAdmin, type CheckinPoint } from '@/app/admin-actions';

const CHECKPOINTS = [
  { value: 'checkin_12nov_am', label: '12 Nov - Mañana (AM)', color: 'bg-blue-500' },
  { value: 'checkin_12nov_pm', label: '12 Nov - Tarde (PM)', color: 'bg-indigo-500' },
  { value: 'checkin_13nov_am', label: '13 Nov - Mañana (AM)', color: 'bg-purple-500' },
  { value: 'checkin_13nov_pm', label: '13 Nov - Tarde (PM)', color: 'bg-pink-500' },
];

export default function ScannerPage() {
  const router = useRouter();
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<CheckinPoint>('checkin_12nov_am');
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastScan, setLastScan] = useState<{
    success: boolean;
    message: string;
    asistente?: any;
  } | null>(null);
  const [scanCount, setScanCount] = useState(0);

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      const session = await getCurrentSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setUsuario(session);
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleScan = async (qrCode: string) => {
    console.log('🔍 Código QR escaneado:', qrCode);

    // Registrar el check-in
    const result = await registrarCheckin({
      qrCode,
      checkpointname: selectedCheckpoint,
    });

    setLastScan(result);
    
    if (result.success) {
      setScanCount((prev) => prev + 1);
    }

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
      setLastScan(null);
    }, 5000);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2b54bf]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2b54bf] to-[#1e3a8a] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Sistema de Check-in</h1>
              <p className="text-sm text-blue-100">Feria Empresarial 2025</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{usuario?.nombre}</p>
                <p className="text-xs text-blue-200">{usuario?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo: Scanner */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Escanear Código QR</h2>
              
              {/* Selector de punto de check-in */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecciona el punto de ingreso:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CHECKPOINTS.map((checkpoint) => (
                    <button
                      key={checkpoint.value}
                      onClick={() => setSelectedCheckpoint(checkpoint.value as CheckinPoint)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedCheckpoint === checkpoint.value
                          ? `${checkpoint.color} text-white border-transparent shadow-lg scale-105`
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-semibold">{checkpoint.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scanner */}
              <div className="mb-4">
                <QRScanner 
                  onScan={handleScan}
                  onError={(error) => {
                    setLastScan({ success: false, message: error });
                  }}
                />
              </div>

              {/* Instrucciones */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Instrucciones
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Selecciona el punto de ingreso correspondiente</li>
                  <li>• Apunta la cámara hacia el código QR del asistente</li>
                  <li>• El sistema registrará automáticamente el ingreso</li>
                  <li>• Si el asistente ya registró ingreso, se mostrará una alerta</li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Panel derecho: Estadísticas y resultados */}
          <div className="space-y-6">
            {/* Contador de escaneos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Estadísticas de Sesión</h3>
              <div className="text-center">
                <div className="text-5xl font-bold text-[#2b54bf] mb-2">{scanCount}</div>
                <div className="text-sm text-gray-600">Check-ins realizados</div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Punto actual: <span className="font-semibold text-gray-700">
                    {CHECKPOINTS.find((cp) => cp.value === selectedCheckpoint)?.label}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Último resultado */}
            <AnimatePresence mode="wait">
              {lastScan && (
                <motion.div
                  key={lastScan.message}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`rounded-xl shadow-lg p-6 ${
                    lastScan.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${lastScan.success ? 'bg-green-500' : 'bg-red-500'}`}>
                      {lastScan.success ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className={`font-semibold mb-1 ${lastScan.success ? 'text-green-900' : 'text-red-900'}`}>
                        {lastScan.success ? '✅ Check-in Exitoso' : '❌ Error'}
                      </h4>
                      <p className={`text-sm ${lastScan.success ? 'text-green-700' : 'text-red-700'}`}>
                        {lastScan.message}
                      </p>
                      {lastScan.asistente && (
                        <div className="mt-2 text-xs text-gray-600">
                          <p><strong>Tipo:</strong> {lastScan.asistente.tipoAsistente}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Acceso rápido */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Accesos Rápidos</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/admin')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium transition flex items-center justify-between"
                >
                  <span>Ver Panel de Administración</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
