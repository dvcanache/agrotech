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

export const exportToPDF = (filename: string, title: string, headers: string[], rows: (string | number | undefined | null)[][]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor habilite las ventanas emergentes para exportar a PDF.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>${title} - AgroTech</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; }
        h1 { font-size: 20px; color: #2d6a4f; margin-bottom: 4px; }
        .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
        th { background-color: #f1f5f9; font-weight: 600; color: #334155; }
        tr:nth-child(even) { background-color: #f8fafc; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="meta">Plataforma AgroTech | Generado: ${new Date().toLocaleDateString('es-VE')}</div>
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(r => `<tr>${r.map(c => `<td>${c ?? ''}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
