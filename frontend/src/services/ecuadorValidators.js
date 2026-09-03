/**
 * ecuadorValidators.js
 * Validadores oficiales de identidad para la República del Ecuador
 * Algoritmo Módulo 10 para Cédula de Identidad y R.U.C.
 * Survey 593 · Kolab Tech S.A.S.
 */

/**
 * Valida una cédula ecuatoriana de 10 dígitos usando el algoritmo Módulo 10 oficial.
 * @param {string} cedula 
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateEcuadorianCedula = (cedula) => {
  if (!cedula) return { valid: false, error: 'Debe ingresar un número de cédula.' };

  const clean = cedula.toString().trim();

  // Debe tener exactamente 10 dígitos numéricos
  if (!/^\d{10}$/.test(clean)) {
    return { valid: false, error: 'La cédula debe contener exactamente 10 dígitos numéricos.' };
  }

  // Código de provincia (dos primeros dígitos entre 01 y 24, o 30 para casos especiales)
  const provincia = parseInt(clean.substring(0, 2), 10);
  if (!((provincia >= 1 && provincia <= 24) || provincia === 30)) {
    return { valid: false, error: 'Los dos primeros dígitos no corresponden a una provincia válida del Ecuador.' };
  }

  // El tercer dígito debe ser menor a 6 para personas naturales
  const tercerDigito = parseInt(clean[2], 10);
  if (tercerDigito >= 6) {
    return { valid: false, error: 'El tercer dígito no corresponde a una cédula de persona natural.' };
  }

  // Coeficientes Módulo 10: 2, 1, 2, 1, 2, 1, 2, 1, 2
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = parseInt(clean[i], 10) * coeficientes[i];
    if (valor >= 10) {
      valor -= 9;
    }
    suma += valor;
  }

  const digitoVerificadorCalculado = (10 - (suma % 10)) % 10;
  const digitoVerificadorReal = parseInt(clean[9], 10);

  if (digitoVerificadorCalculado !== digitoVerificadorReal) {
    return { valid: false, error: 'El dígito verificador no coincide. La cédula no es matemáticamente válida.' };
  }

  return { valid: true };
};

/**
 * Valida un RUC ecuatoriano de 13 dígitos.
 * @param {string} ruc 
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateEcuadorianRuc = (ruc) => {
  if (!ruc) return { valid: false, error: 'Debe ingresar un número de R.U.C.' };
  const clean = ruc.toString().trim();

  if (!/^\d{13}$/.test(clean)) {
    return { valid: false, error: 'El R.U.C. debe contener exactamente 13 dígitos numéricos.' };
  }

  // Los últimos tres dígitos de un RUC de persona natural son 001
  if (!clean.endsWith('001')) {
    return { valid: false, error: 'El R.U.C. debe terminar en el establecimiento 001.' };
  }

  // Si es persona natural (tercer dígito < 6), los primeros 10 dígitos forman una cédula válida
  const tercerDigito = parseInt(clean[2], 10);
  if (tercerDigito < 6) {
    const cedulaCheck = validateEcuadorianCedula(clean.substring(0, 10));
    if (!cedulaCheck.valid) {
      return { valid: false, error: `R.U.C. inválido: ${cedulaCheck.error}` };
    }
  }

  return { valid: true };
};

/**
 * Enmascara un correo electrónico para proteger la privacidad mostrando solo pistas.
 * Ejemplo: orion@gmail.com -> or***@gmail.com
 * @param {string} email 
 * @returns {string}
 */
export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email || '';
  const [user, domain] = email.split('@');
  if (user.length <= 2) {
    return `${user}***@${domain}`;
  }
  const visible = user.substring(0, 2);
  return `${visible}***@${domain}`;
};
