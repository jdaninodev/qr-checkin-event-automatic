import bcrypt from 'bcryptjs';

// Generar hash de contraseña para el usuario administrador
const password = 'Feria2025!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al generar hash:', err);
    return;
  }
  
  console.log('\n=== Hash generado ===');
  console.log('Contraseña:', password);
  console.log('Hash:', hash);
  console.log('\n=== SQL para insertar admin ===');
  console.log(`
INSERT INTO admin_users (nombre, email, password_hash, rol)
VALUES (
  'Administrador Principal',
  'admin@feria.com',
  '${hash}',
  'admin'
)
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;
  `);
  console.log('\n');
});
