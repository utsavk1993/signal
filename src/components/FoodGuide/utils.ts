import Papa from 'papaparse';

export const parseCSV = async (csv: File) => {
  return new Promise((resolve) => {
    Papa.parse(csv, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;
        resolve(data);
      },
    });
  });
};
