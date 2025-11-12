import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import QRCode from 'qrcode';

// Script para importar asistentes desde un CSV a la base de datos
// Uso: node --loader ts-node/esm scripts/import-csv.ts

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no está configurado');
  process.exit(1);
}

interface CSVRow {
  [key: string]: string;
}

async function generarCodigoQR(numeroDocumento: string, id: number): Promise<string> {
  const codigoUnico = `FERIA2025-${numeroDocumento}-${id}`;
  const qrDataUrl = await QRCode.toDataURL(codigoUnico, {
    width: 300,
    margin: 2,
    color: {
      dark: '#2b54bf',
      light: '#ffffff'
    }
  });
  return codigoUnico;
}

async function importarCSV(csvPath: string) {
  console.log('📁 Leyendo archivo CSV:', csvPath);

  // Leer archivo CSV
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  
  // Parsear CSV
  const records: CSVRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`✅ Se encontraron ${records.length} registros en el CSV`);
  console.log('📋 Columnas disponibles:', Object.keys(records[0]));

  // Conectar a la base de datos
  const sql = neon(DATABASE_URL!);
  console.log('🔌 Conectado a la base de datos');

  let importados = 0;
  let duplicados = 0;
  let errores = 0;

  for (const [index, row] of records.entries()) {
    try {
      console.log(`\n[${index + 1}/${records.length}] Procesando:`, row);

      // Mapear las columnas del CSV a los campos de la base de datos
      // AJUSTA ESTOS NOMBRES SEGÚN TU CSV
      const tipoAsistente = row['Tipo de asistente']?.toLowerCase() === 'estudiante' ? 'estudiante' : 'acudiente';
      const jornada = row['Jornada']?.toLowerCase() || null;
      const nombres = row['Nombres'] || row['nombres'] || '';
      const apellidos = row['Apellidos'] || row['apellidos'] || '';
      const tipoDocumento = row['Tipo de documento'] || row['tipo_documento'] || 'CC';
      const numeroDocumento = row['Número de documento'] || row['numero_documento'] || '';
      const correoElectronico = row['Correo electrónico'] || row['correo'] || null;
      const telefono = row['Teléfono'] || row['telefono'] || null;
      
      // Campos de estudiante
      const grado = tipoAsistente === 'estudiante' ? (row['Grado'] || row['grado']) : null;
      const grupo = tipoAsistente === 'estudiante' ? (row['Grupo'] || row['grupo']) : null;
      const nombreAcudiente = tipoAsistente === 'estudiante' ? (row['Nombre del acudiente'] || row['nombre_acudiente']) : null;
      
      // Campos de acudiente
      const profesion = tipoAsistente === 'acudiente' ? (row['Profesión'] || row['profesion']) : null;
      const empresa = tipoAsistente === 'acudiente' ? (row['Empresa'] || row['empresa']) : null;
      const cargo = tipoAsistente === 'acudiente' ? (row['Cargo'] || row['cargo']) : null;

      if (!nombres || !apellidos || !numeroDocumento) {
        console.log('⚠️ Falta información requerida, saltando...');
        errores++;
        continue;
      }

      // Verificar si ya existe
      const existente = await sql`
        SELECT id FROM asistentes WHERE numero_documento = ${numeroDocumento}
      `;

      if (existente.length > 0) {
        console.log('⏭️ Ya existe, saltando...');
        duplicados++;
        continue;
      }

      // Insertar asistente
      const result = await sql`
        INSERT INTO asistentes (
          tipo_asistente, jornada, nombres, apellidos, tipo_documento,
          numero_documento, correo_electronico, telefono,
          grado, grupo, nombre_acudiente,
          profesion, empresa, cargo,
          acepta_politicas
        ) VALUES (
          ${tipoAsistente},
          ${jornada},
          ${nombres},
          ${apellidos},
          ${tipoDocumento},
          ${numeroDocumento},
          ${correoElectronico},
          ${telefono},
          ${grado},
          ${grupo},
          ${nombreAcudiente},
          ${profesion},
          ${empresa},
          ${cargo},
          true
        )
        RETURNING id
      `;

      const registroId = result[0].id;

      // Generar y guardar código QR
      const codigoQR = await generarCodigoQR(numeroDocumento, registroId);
      await sql`
        UPDATE asistentes 
        SET qr_code = ${codigoQR}
        WHERE id = ${registroId}
      `;

      console.log(`✅ Importado: ${nombres} ${apellidos} (ID: ${registroId}, QR: ${codigoQR})`);
      importados++;

    } catch (error: any) {
      console.error(`❌ Error en fila ${index + 1}:`, error.message);
      errores++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE IMPORTACIÓN');
  console.log('='.repeat(60));
  console.log(`✅ Importados: ${importados}`);
  console.log(`⏭️ Duplicados (saltados): ${duplicados}`);
  console.log(`❌ Errores: ${errores}`);
  console.log(`📝 Total procesados: ${records.length}`);
  console.log('='.repeat(60));
}

// Obtener ruta del CSV desde argumentos de línea de comandos
const csvPath = process.argv[2] || 'Formulario de asistencia - Feria Empresarial.csv';

if (!fs.existsSync(csvPath)) {
  console.error(`❌ No se encontró el archivo: ${csvPath}`);
  console.log('\n💡 Uso: npm run import-csv [ruta-al-archivo.csv]');
  console.log('   Ejemplo: npm run import-csv "datos.csv"');
  process.exit(1);
}

importarCSV(csvPath)
  .then(() => {
    console.log('\n✅ Importación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });
