'use server';

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { createSession, setSessionCookie, deleteSession, getSession } from '@/lib/auth';

export type CheckinPoint = 'checkin_12nov_am' | 'checkin_12nov_pm' | 'checkin_13nov_am' | 'checkin_13nov_pm';

export interface LoginData {
  email: string;
  password: string;
}

export interface CheckinData {
  qrCode: string;
  checkpointname: CheckinPoint;
}

/**
 * Autentica un usuario administrador
 */
export async function loginAdmin(data: LoginData) {
  try {
    console.log('🔐 [LOGIN] Intentando autenticar:', data.email);

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL no está configurado');
    }

    const sql = neon(process.env.DATABASE_URL);

    // Buscar usuario por email
    const users = await sql`
      SELECT id, nombre, email, password_hash, rol, activo
      FROM admin_users
      WHERE email = ${data.email}
      LIMIT 1
    `;

    if (users.length === 0) {
      console.log('❌ [LOGIN] Usuario no encontrado');
      return {
        success: false,
        message: 'Credenciales inválidas',
      };
    }

    const user = users[0];

    // Verificar que el usuario esté activo
    if (!user.activo) {
      console.log('❌ [LOGIN] Usuario inactivo');
      return {
        success: false,
        message: 'Usuario inactivo. Contacta al administrador.',
      };
    }

    // Verificar contraseña
    const passwordValid = await bcrypt.compare(data.password, user.password_hash);

    if (!passwordValid) {
      console.log('❌ [LOGIN] Contraseña incorrecta');
      return {
        success: false,
        message: 'Credenciales inválidas',
      };
    }

    // Crear sesión JWT
    const sessionData = {
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
    };

    const token = await createSession(sessionData);
    await setSessionCookie(token);

    console.log('✅ [LOGIN] Autenticación exitosa:', user.email);

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  } catch (error: any) {
    console.error('❌ [LOGIN] Error:', error);
    return {
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message,
    };
  }
}

/**
 * Cierra la sesión del usuario
 */
export async function logoutAdmin() {
  await deleteSession();
  return { success: true };
}

/**
 * Obtiene la sesión actual
 */
export async function getCurrentSession() {
  const session = await getSession();
  return session;
}

/**
 * Registra un check-in escaneando el código QR
 */
export async function registrarCheckin(data: CheckinData) {
  try {
    console.log('📋 [CHECKIN] Iniciando check-in:', data);

    // Verificar que el usuario esté autenticado
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'No autenticado. Inicia sesión primero.',
      };
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL no está configurado');
    }

    const sql = neon(process.env.DATABASE_URL);

    // Buscar al asistente por código QR
    const asistentes = await sql`
      SELECT id, nombres, apellidos, tipo_asistente, qr_code,
             checkin_12nov_am, checkin_12nov_pm, checkin_13nov_am, checkin_13nov_pm
      FROM asistentes
      WHERE qr_code = ${data.qrCode}
      LIMIT 1
    `;

    if (asistentes.length === 0) {
      console.log('❌ [CHECKIN] Código QR no encontrado:', data.qrCode);
      return {
        success: false,
        message: 'Código QR no válido o no encontrado',
      };
    }

    const asistente = asistentes[0];

    // Verificar si ya hizo check-in en este punto
    if (asistente[data.checkpointname]) {
      console.log('⚠️ [CHECKIN] Ya registró check-in en este punto');
      return {
        success: false,
        message: `${asistente.nombres} ya registró su ingreso en esta sesión`,
        asistente: {
          nombres: asistente.nombres,
          apellidos: asistente.apellidos,
          checkinPrevio: asistente[data.checkpointname],
        },
      };
    }

    // Registrar el check-in usando SQL dinámico seguro
    if (data.checkpointname === 'checkin_12nov_am') {
      await sql`UPDATE asistentes SET checkin_12nov_am = CURRENT_TIMESTAMP WHERE id = ${asistente.id}`;
    } else if (data.checkpointname === 'checkin_12nov_pm') {
      await sql`UPDATE asistentes SET checkin_12nov_pm = CURRENT_TIMESTAMP WHERE id = ${asistente.id}`;
    } else if (data.checkpointname === 'checkin_13nov_am') {
      await sql`UPDATE asistentes SET checkin_13nov_am = CURRENT_TIMESTAMP WHERE id = ${asistente.id}`;
    } else if (data.checkpointname === 'checkin_13nov_pm') {
      await sql`UPDATE asistentes SET checkin_13nov_pm = CURRENT_TIMESTAMP WHERE id = ${asistente.id}`;
    }

    console.log('✅ [CHECKIN] Check-in registrado exitosamente');

    return {
      success: true,
      message: `Check-in exitoso para ${asistente.nombres} ${asistente.apellidos}`,
      asistente: {
        nombres: asistente.nombres,
        apellidos: asistente.apellidos,
        tipoAsistente: asistente.tipo_asistente,
      },
    };
  } catch (error: any) {
    console.error('❌ [CHECKIN] Error:', error);
    return {
      success: false,
      message: 'Error al registrar check-in',
      error: error.message,
    };
  }
}

/**
 * Obtiene estadísticas de check-ins por punto
 */
export async function obtenerEstadisticasCheckin() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL no está configurado');
    }

    const sql = neon(process.env.DATABASE_URL);

    const stats = await sql`
      SELECT 
        COUNT(*) as total_registrados,
        COUNT(checkin_12nov_am) as checkin_12nov_am_count,
        COUNT(checkin_12nov_pm) as checkin_12nov_pm_count,
        COUNT(checkin_13nov_am) as checkin_13nov_am_count,
        COUNT(checkin_13nov_pm) as checkin_13nov_pm_count,
        COUNT(CASE WHEN tipo_asistente = 'estudiante' THEN 1 END) as total_estudiantes,
        COUNT(CASE WHEN tipo_asistente = 'acudiente' THEN 1 END) as total_acudientes
      FROM asistentes
    `;

    return {
      success: true,
      data: stats[0],
    };
  } catch (error: any) {
    console.error('❌ [STATS] Error:', error);
    return {
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message,
    };
  }
}

/**
 * Obtiene lista detallada de asistentes con sus check-ins
 */
export async function obtenerAsistentesConCheckins() {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'No autenticado',
      };
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL no está configurado');
    }

    const sql = neon(process.env.DATABASE_URL);

    const asistentes = await sql`
      SELECT 
        id, nombres, apellidos, tipo_asistente, numero_documento,
        checkin_12nov_am, checkin_12nov_pm, checkin_13nov_am, checkin_13nov_pm,
        created_at
      FROM asistentes
      ORDER BY created_at DESC
    `;

    return {
      success: true,
      data: asistentes,
    };
  } catch (error: any) {
    console.error('❌ [LISTA] Error:', error);
    return {
      success: false,
      message: 'Error al obtener lista de asistentes',
      error: error.message,
    };
  }
}
