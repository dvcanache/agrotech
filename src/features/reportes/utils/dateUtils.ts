/**
 * Utilidades para cálculo dinámico de fechas y días restantes zootécnicos.
 */

/**
 * Calcula la diferencia en días enteros entre una fecha de evento ('YYYY-MM-DD' o ISO)
 * y la fecha actual del sistema.
 * 
 * @param fechaEventoStr Cadena con la fecha del evento.
 * @returns Número entero de días restantes. Positivo si está en el futuro, 0 si es hoy, negativo si ya pasó.
 */
export function calculateDiasRestantes(fechaEventoStr?: string): number {
  if (!fechaEventoStr) return 0;

  // Extraer año, mes y día para evitar desfases de husos horarios locales
  const partes = fechaEventoStr.split('-');
  if (partes.length === 3) {
    const y = parseInt(partes[0], 10);
    const m = parseInt(partes[1], 10) - 1;
    const d = parseInt(partes[2], 10);
    const targetDate = new Date(y, m, d);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffMs = targetDate.getTime() - today.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }

  const targetDate = new Date(fechaEventoStr);
  if (isNaN(targetDate.getTime())) return 0;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = targetDate.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
