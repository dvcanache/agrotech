/**
 * Utilidades para exportación de datos de reportes a CSV/XLSX descargable y PDF
 */

export const exportToCSV = (filename: string, headers: string[], rows: (string | number | undefined | null)[][]) => {
  const sanitize = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Añadir directiva sep=, en la primera línea para compatibilidad automática con Excel en español
  const csvContent = [
    'sep=,',
    headers.map(h => sanitize(h)).join(','),
    ...rows.map(row => row.map(cell => sanitize(cell)).join(','))
  ].join('\r\n');

  // Agregar BOM UTF-8 (\uFEFF) para que Excel reconozca tildes, ñ y caracteres latinos
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
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${filename} - ${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1e293b; }
    h1 { font-size: 20px; color: #2d6a4f; margin-bottom: 4px; font-weight: 700; }
    .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    th { background-color: #f1f5f9; font-weight: 600; color: #334155; }
    tr:nth-child(even) { background-color: #f8fafc; }
    @media print {
      body { padding: 0; }
      @page { margin: 1.5cm; }
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">Plataforma AgroGan | Archivo: ${filename} | Generado: ${new Date().toLocaleDateString('es-VE')} ${new Date().toLocaleTimeString('es-VE')}</div>
  <table>
    <thead>
      <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${rows.map(r => `<tr>${r.map(c => `<td>${c ?? ''}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;

  // 1. Intentar abrir ventana emergente directa
  let printWindow: Window | null = null;
  try {
    printWindow = window.open('', '_blank');
  } catch {
    printWindow = null;
  }

  if (printWindow && !printWindow.closed) {
    try {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        try {
          printWindow?.focus();
          printWindow?.print();
        } catch {}
      };
      setTimeout(() => {
        try {
          printWindow?.focus();
          printWindow?.print();
        } catch {}
      }, 500);
      return;
    } catch {
      // Continuar con fallback por iframe
    }
  }

  // 2. Fallback: Si el popup fue bloqueado, imprimir a través de un iframe invisible sin ser bloqueado
  try {
    const iframeId = 'agrotech-pdf-print-iframe';
    let iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
    if (iframe && iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }

    iframe = document.createElement('iframe');
    iframe.id = iframeId;
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc && iframe.contentWindow) {
      doc.open();
      doc.write(html);
      doc.close();

      const frameWindow = iframe.contentWindow;
      setTimeout(() => {
        try {
          frameWindow.focus();
          frameWindow.print();
        } catch {
          window.print();
        }
      }, 350);
      return;
    }
  } catch (iframeErr) {
    console.warn('Fallback iframe falló:', iframeErr);
  }

  // 3. Fallback de aviso si el entorno no permitió ninguna acción
  alert('La ventana de impresión fue bloqueada por el navegador. Por favor permita ventanas emergentes o verifique la configuración de impresión de su navegador.');
};
