import { Resend } from 'resend';

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  nombre: string;
  apellidos: string;
  numeroDocumento: string;
  tipoAsistente: string;
  jornada?: string;
  qrCodeDataUrl: string; // Data URL del QR en base64
}

/**
 * Genera el HTML del email con el ticket y código QR
 */
function generateEmailHTML(data: EmailData): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket de Asistencia - Feria Empresarial 2025</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <!-- Container principal -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header con colores de la institución -->
          <tr>
            <td style="background: linear-gradient(135deg, #2b54bf 0%, #fed113 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                ✅ Registro Confirmado
              </h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">
                Feria Empresarial 2025
              </p>
            </td>
          </tr>

          <!-- Información del asistente -->
          <tr>
            <td style="padding: 30px 40px;">
              <h2 style="color: #2b54bf; margin: 0 0 20px 0; font-size: 22px;">
                ¡Hola ${data.nombre}!
              </h2>
              <p style="color: #333333; line-height: 1.6; margin: 0 0 20px 0;">
                Tu registro para la <strong>Feria Empresarial 2025</strong> ha sido confirmado exitosamente.
              </p>

              <!-- Detalles del registro -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; color: #666;">
                      <strong style="color: #2b54bf;">Nombre completo:</strong><br>
                      ${data.nombre} ${data.apellidos}
                    </p>
                    <p style="margin: 0 0 10px 0; color: #666;">
                      <strong style="color: #2b54bf;">Documento:</strong><br>
                      ${data.numeroDocumento}
                    </p>
                    <p style="margin: 0 0 10px 0; color: #666;">
                      <strong style="color: #2b54bf;">Tipo de asistente:</strong><br>
                      ${data.tipoAsistente === 'estudiante' ? 'Estudiante' : 'Acudiente / Padre de familia'}
                    </p>
                    ${data.jornada ? `
                    <p style="margin: 0; color: #666;">
                      <strong style="color: #2b54bf;">Jornada:</strong><br>
                      ${data.jornada.charAt(0).toUpperCase() + data.jornada.slice(1)}
                    </p>
                    ` : ''}
                  </td>
                </tr>
              </table>

              <!-- Código QR -->
              <div style="text-align: center; margin: 30px 0;">
                <h3 style="color: #2b54bf; margin: 0 0 15px 0;">
                  Tu código QR de acceso
                </h3>
                <p style="color: #666; margin: 0 0 20px 0; font-size: 14px;">
                  Presenta este código al ingresar al evento
                </p>
                <div style="background-color: #ffffff; border: 3px solid #2b54bf; border-radius: 12px; padding: 20px; display: inline-block;">
                  <img src="${data.qrCodeDataUrl}" alt="Código QR" width="250" height="250" style="display: block;">
                </div>
                <p style="color: #999; margin: 15px 0 0 0; font-size: 12px;">
                  Código: ${data.numeroDocumento}
                </p>
              </div>

              <!-- Instrucciones -->
              <div style="background-color: #fff8e1; border-left: 4px solid #fed113; padding: 15px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #f57c00;">
                  📱 Instrucciones importantes:
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #666;">
                  <li style="margin: 5px 0;">Guarda este email o toma una captura de pantalla del QR</li>
                  <li style="margin: 5px 0;">Presenta el código QR al llegar al evento</li>
                  <li style="margin: 5px 0;">Puedes mostrarlo desde tu teléfono o imprimirlo</li>
                  <li style="margin: 5px 0;">Asegúrate de llegar 10 minutos antes de tu jornada</li>
                </ul>
              </div>

              <!-- Información del evento -->
              <div style="text-align: center; margin: 30px 0 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                <h4 style="color: #2b54bf; margin: 0 0 10px 0;">
                  📅 Detalles del Evento
                </h4>
                <p style="margin: 5px 0; color: #666;">
                  <strong>Fechas:</strong> 12 y 13 de Noviembre de 2025
                </p>
                <p style="margin: 5px 0; color: #666;">
                  <strong>Jornadas:</strong> Mañana y Tarde
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                ¿Tienes alguna pregunta? Contáctanos
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                © 2025 Feria Empresarial. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Envía un email con el ticket y código QR al asistente
 */
export async function enviarTicketEmail(data: EmailData) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY no está configurado');
      return {
        success: false,
        message: 'Servicio de email no configurado',
      };
    }

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Feria Empresarial <onboarding@resend.dev>',
      to: data.to,
      subject: '🎟️ Tu ticket para la Feria Empresarial 2025',
      html: generateEmailHTML(data),
    });

    console.log('Email enviado exitosamente:', result);

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error: any) {
    console.error('Error al enviar email:', error);
    return {
      success: false,
      message: 'Error al enviar el email',
      error: error.message,
    };
  }
}
