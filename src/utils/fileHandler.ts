import { saveAs } from 'file-saver';

/**
 * Read a file as text
 * @param file - The file to read
 * @returns Promise that resolves to the file content as string
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Save data as a file
 * @param data - The data to save
 * @param filename - The name of the file
 * @param mimeType - The MIME type of the file
 */
export function saveFile(data: string | Blob, filename: string, mimeType: string = 'text/plain'): void {
  let blob: Blob;
  
  if (typeof data === 'string') {
    blob = new Blob([data], { type: mimeType });
  } else {
    blob = data;
  }
  
  saveAs(blob, filename);
}

/**
 * Get file extension from filename
 * @param filename - The filename
 * @returns The file extension (without dot)
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Change file extension
 * @param filename - Original filename
 * @param newExtension - New extension (without dot)
 * @returns Filename with new extension
 */
export function changeFileExtension(filename: string, newExtension: string): string {
  const name = filename.substring(0, filename.lastIndexOf('.')) || filename;
  return `${name}.${newExtension}`;
}
