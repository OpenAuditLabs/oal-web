export function downloadCsv<T extends Record<string, unknown>>(filename: string, data: T[]) {
  if (data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) {
        return '';
      }
      // Escape double quotes by doubling them, then enclose the field in double quotes if it contains a comma, double quote, or newline
      const stringVal = String(val);
      const needsQuotes = stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n');
      const escapedVal = stringVal.replace(/"/g, '""');
      return needsQuotes ? `"${escapedVal}"` : escapedVal;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) { // Feature detection for "download" attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Fallback for browsers that don't support HTML5 download attribute
    window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csvString));
  }
}