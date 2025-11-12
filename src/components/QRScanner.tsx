'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    const initScanner = async () => {
      try {
        // Solicitar permiso de cámara
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } // Usar cámara trasera en móviles
        });
        
        setHasPermission(true);
        
        // Inicializar el lector de QR
        const codeReader = new BrowserQRCodeReader();
        readerRef.current = codeReader;

        if (videoRef.current) {
          setIsScanning(true);
          
          // Comenzar a escanear
          codeReader.decodeFromVideoDevice(
            null, // null = usar cámara por defecto
            videoRef.current,
            (result, error) => {
              if (result) {
                const qrText = result.getText();
                console.log('📷 QR escaneado:', qrText);
                onScan(qrText);
                // Pausar brevemente para evitar múltiples escaneos del mismo código
                setIsScanning(false);
                setTimeout(() => setIsScanning(true), 2000);
              }
              if (error && error.name !== 'NotFoundException') {
                console.error('Error al escanear:', error);
              }
            }
          );
        }
      } catch (err: any) {
        console.error('Error al acceder a la cámara:', err);
        setHasPermission(false);
        onError?.('No se pudo acceder a la cámara. Verifica los permisos.');
      }
    };

    initScanner();

    // Cleanup: detener el stream cuando se desmonte el componente
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, [onScan, onError]);

  if (hasPermission === false) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          No se puede acceder a la cámara
        </h3>
        <p className="text-red-600 text-sm">
          Por favor, permite el acceso a la cámara en la configuración de tu navegador
        </p>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2b54bf] mx-auto mb-4"></div>
        <p className="text-gray-600">Inicializando cámara...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full h-auto rounded-lg border-4 border-[#2b54bf] shadow-lg"
        style={{ maxHeight: '400px', objectFit: 'cover' }}
      />
      
      {/* Overlay de marco de escaneo */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-64 h-64 border-4 border-[#fed113] rounded-lg animate-pulse"></div>
      </div>

      {/* Indicador de estado */}
      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
        <span className="text-xs font-medium">{isScanning ? 'Escaneando' : 'Pausado'}</span>
      </div>
    </div>
  );
}
