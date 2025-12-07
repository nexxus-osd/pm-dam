// ============================================================
// SERIALIZACIÓN DE DATOS PARA COMPONENTES DEL CLIENTE
// ============================================================

/**
 * Convierte objetos Decimal a números para compatibilidad con Client Components
 * @param obj Objeto a serializar
 * @returns Objeto con valores Decimal convertidos a números
 */
export function serializeForClient(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const serialized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Verificar si es un objeto Decimal de Prisma
        if (obj[key] && typeof obj[key] === 'object' && 'd' in obj[key] && Array.isArray(obj[key].d)) {
          // Convertir Decimal a número
          serialized[key] = parseFloat(obj[key].toString());
        } else if (obj[key] instanceof Date) {
          // Convertir fechas a strings ISO
          serialized[key] = obj[key].toISOString();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          // Recursivamente serializar objetos anidados
          serialized[key] = serializeForClient(obj[key]);
        } else {
          serialized[key] = obj[key];
        }
      }
    }
    return serialized;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => serializeForClient(item));
  }

  return obj;
}

/**
 * Convierte específicamente valores monetarios de Decimal a número
 * @param decimalValue Valor Decimal a convertir
 * @returns Número flotante
 */
export function decimalToNumber(decimalValue: any): number {
  if (!decimalValue) return 0;
  
  // Si es un objeto Decimal de Prisma
  if (typeof decimalValue === 'object' && decimalValue !== null && 'd' in decimalValue) {
    return parseFloat(decimalValue.toString());
  }
  
  // Si ya es un número
  if (typeof decimalValue === 'number') {
    return decimalValue;
  }
  
  // Si es un string
  if (typeof decimalValue === 'string') {
    return parseFloat(decimalValue);
  }
  
  return 0;
}