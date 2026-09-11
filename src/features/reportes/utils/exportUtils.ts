/**
 * Utilidades para exportación de datos de reportes a CSV/XLSX descargable
 */

export const exportToCSV = (filename: string, headers: string[], rows: (string | number | undefined | null)[][]) => {
  const sanitize = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(h => sanitize(h)).join(','),
    ...rows.map(row => row.map(cell => sanitize(cell)).join(','))
  ].join('\r\n');

  // Agregar BOM UTF-8 para que Excel reconozca tildes y caracteres en español
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
