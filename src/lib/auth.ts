import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Clave secreta para JWT (debe estar en .env)
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'feria-empresarial-2025-secret-key-change-this'
);

export interface SessionData {
  userId: number;
  email: string;
  nombre: string;
  rol: string;
}

/**
 * Crea un token JWT con los datos del usuario
 */
export async function createSession(data: SessionData): Promise<string> {
  const token = await new SignJWT({ ...data })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h') // Token válido por 8 horas
    .sign(SECRET_KEY);

  return token;
}

/**
 * Verifica y decodifica un token JWT
 */
export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    return verified.payload as unknown as SessionData;
  } catch (error) {
    return null;
  }
}

/**
 * Guarda el token en una cookie
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 horas
    path: '/',
  });
}

/**
 * Obtiene la sesión actual desde las cookies
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  return verifySession(token);
}

/**
 * Elimina la sesión (logout)
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
