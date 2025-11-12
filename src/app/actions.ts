'use server';

import { neon } from '@neondatabase/serverless';
import QRCode from 'qrcode';
import { enviarTicketEmail } from '@/lib/email';

// Tipos para los datos del formulario
export interface AsistenteData {
  tipoAsistente: 'estudiante' | 'acudiente';
  jornada?: 'mañana' | 'tarde' | 'ambas';
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correoElectronico?: string;
  telefono?: string;
  
  // Campos específicos de estudiante
  grado?: string;
  grupo?: string;
  nombreAcudiente?: string;
  
  // Campos específicos de acudiente
  profesion?: string;
  empresa?: string;
  cargo?: string;
  
  aceptaPoliticas: boolean;
}

/**
 * Genera un código QR único para el asistente
 */
async function generarCodigoQR(numeroDocumento: string, id: number): Promise<string> {
  // Formato del código: FERIA2025-TIPO-DOCUMENTO-ID
  const codigoUnico = `FERIA2025-${numeroDocumento}-${id}`;
  
  // Generar QR como data URL (base64)
  const qrDataUrl = await QRCode.toDataURL(codigoUnico, {
    width: 300,
    margin: 2,
    color: {
      dark: '#2b54bf',
      light: '#ffffff'
    }
  });
  
  return qrDataUrl;
}

/**
 * Registra un nuevo asistente en la base de datos
 * @param data Datos del asistente a registrar
 * @returns Objeto con success y mensaje
 */
export async function registrarAsistente(data: AsistenteData) {
  try {
    // Validar que DATABASE_URL esté configurado
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL no está configurado');
    }

    // Conectar a Neon
    const sql = neon(process.env.DATABASE_URL);

    // Validaciones básicas
    if (!data.nombres || !data.apellidos || !data.numeroDocumento) {
      return {
        success: false,
        message: 'Faltan campos obligatorios: nombres, apellidos y número de documento',
      };
    }

    if (!data.aceptaPoliticas) {
      return {
        success: false,
        message: 'Debes aceptar las políticas de privacidad',
      };
    }

    if (!data.correoElectronico) {
      return {
        success: false,
        message: 'El correo electrónico es obligatorio para recibir tu ticket',
      };
    }

    // Verificar si ya existe un registro con este documento
    const existente = await sql`
      SELECT id FROM asistentes WHERE numero_documento = ${data.numeroDocumento}
    `;

    if (existente.length > 0) {
      return {
        success: false,
        message: 'Ya existe un registro con este número de documento',
      };
    }

    // Insertar el nuevo asistente
    const result = await sql`
      INSERT INTO asistentes (
        tipo_asistente, jornada, nombres, apellidos, tipo_documento,
        numero_documento, correo_electronico, telefono,
        grado, grupo, nombre_acudiente,
        profesion, empresa, cargo,
        acepta_politicas
      ) VALUES (
        ${data.tipoAsistente},
        ${data.jornada || null},
        ${data.nombres},
        ${data.apellidos},
        ${data.tipoDocumento},
        ${data.numeroDocumento},
        ${data.correoElectronico || null},
        ${data.telefono || null},
        ${data.grado || null},
        ${data.grupo || null},
        ${data.nombreAcudiente || null},
        ${data.profesion || null},
        ${data.empresa || null},
        ${data.cargo || null},
        ${data.aceptaPoliticas}
      )
      RETURNING id
    `;

    const registroId = result[0].id;

    // Generar código QR único
    const codigoQR = `FERIA2025-${data.numeroDocumento}-${registroId}`;
    const qrDataUrl = await generarCodigoQR(data.numeroDocumento, registroId);

    // Actualizar el registro con el código QR
    await sql`
      UPDATE asistentes 
      SET qr_code = ${codigoQR}
      WHERE id = ${registroId}
    `;

    // Enviar email con el ticket solo si hay correo válido
    let emailEnviado = false;
    if (data.correoElectronico) {
      const emailResult = await enviarTicketEmail({
        to: data.correoElectronico,
        nombre: data.nombres,
        apellidos: data.apellidos,
        numeroDocumento: data.numeroDocumento,
        tipoAsistente: data.tipoAsistente,
        jornada: data.jornada,
        qrCodeDataUrl: qrDataUrl,
      });

      emailEnviado = emailResult.success;
      
      if (!emailResult.success) {
        console.error('Error al enviar email:', emailResult.message);
      }
    }

    return {
      success: true,
      message: emailEnviado 
        ? 'Registro exitoso. Revisa tu correo para ver tu ticket con código QR.'
        : 'Registro exitoso. No se pudo enviar el email, contacta a soporte.',
      id: registroId,
      qrCode: codigoQR,
      emailEnviado,
    };
  } catch (error: any) {
    console.error('Error al registrar asistente:', error);
    
    // Manejar error de duplicado (por si acaso)
    if (error.code === '23505') {
      return {
        success: false,
        message: 'Ya existe un registro con este número de documento',
      };
    }

    return {
      success: false,
      message: 'Error al registrar el asistente. Por favor intenta de nuevo.',
      error: error.message,
    };
  }
}

/**
 * Obtiene todos los asistentes registrados (para panel admin)
 * @returns Lista de asistentes
 */
export async function obtenerAsistentes() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL no está configurado');
    }

    const sql = neon(process.env.DATABASE_URL);
    
    const asistentes = await sql`
      SELECT 
        id, tipo_asistente, jornada, nombres, apellidos,
        tipo_documento, numero_documento, correo_electronico, telefono,
        grado, grupo, nombre_acudiente,
        profesion, empresa, cargo,
        created_at
      FROM asistentes
      ORDER BY created_at DESC
    `;

    return {
      success: true,
      data: asistentes,
    };
  } catch (error: any) {
    console.error('Error al obtener asistentes:', error);
    return {
      success: false,
      message: 'Error al obtener los registros',
      error: error.message,
    };
  }
}

/**
 * Obtiene estadísticas de asistencia
 * @returns Estadísticas básicas
 */
export async function obtenerEstadisticas() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL no está configurado');
    }

    const sql = neon(process.env.DATABASE_URL);
    
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN tipo_asistente = 'estudiante' THEN 1 END) as estudiantes,
        COUNT(CASE WHEN tipo_asistente = 'acudiente' THEN 1 END) as acudientes,
        COUNT(CASE WHEN jornada = 'mañana' THEN 1 END) as jornada_manana,
        COUNT(CASE WHEN jornada = 'tarde' THEN 1 END) as jornada_tarde,
        COUNT(CASE WHEN jornada = 'ambas' THEN 1 END) as jornada_ambas
      FROM asistentes
    `;

    return {
      success: true,
      data: stats[0],
    };
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    return {
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message,
    };
  }
}
