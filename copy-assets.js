import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsToCopy = [
  { 
    src: path.join(__dirname, 'eulogio.png'),
    dest: path.join(__dirname, 'dist', 'eulogio.png') 
  },
  { 
    src: path.join(__dirname, 'pepi.png'), // Actualizado de clara.png a pepi.png
    dest: path.join(__dirname, 'dist', 'pepi.png')  // Actualizado de clara.png a pepi.png
  },
  { 
    src: path.join(__dirname, 'metadata.json'),
    dest: path.join(__dirname, 'dist', 'metadata.json')
  },
  {
    src: path.join(__dirname, 'index.html'),
    dest: path.join(__dirname, 'dist', 'index.html')
  },
  {
    src: path.join(__dirname, 'manifest.json'),
    dest: path.join(__dirname, 'dist', 'manifest.json')
  },
  {
    src: path.join(__dirname, 'service-worker.js'),
    dest: path.join(__dirname, 'dist', 'service-worker.js')
  },
  {
    src: path.join(__dirname, 'icons'), // Directorio de iconos PWA
    dest: path.join(__dirname, 'dist', 'icons')
  }
];

async function copyAssets() {
  try {
    await fs.ensureDir(path.join(__dirname, 'dist'));
    // No es necesario asegurar dist/icons aquí si fs.copy lo maneja para directorios

    for (const asset of assetsToCopy) {
      if (await fs.pathExists(asset.src)) {
        await fs.copy(asset.src, asset.dest, { overwrite: true }); // fs.copy maneja archivos y directorios
        console.log(`Copiado ${asset.src} a ${asset.dest}`);
      } else {
        const srcPathString = asset.src.split(path.sep).pop(); // Obtener el último segmento de la ruta

        if (srcPathString === 'icons') { // Comprobar si es la entrada del directorio 'icons'
             console.warn(`Directorio de iconos PWA (${asset.src}) no encontrado. Por favor, créalo y añade los archivos de icono como se especifica en manifest.json. La aplicación funcionará, pero los iconos PWA podrían faltar. Omitiendo.`);
        } else if (srcPathString === 'pepi.png') { // Actualizado de clara.png a pepi.png
             console.warn(`Activo ${asset.src} no encontrado. Omitiendo. (Nota: pepi.png es para la asistente Pepi. Asegúrate de que el archivo existe en la raíz del proyecto).`);
        } else if (srcPathString === 'manifest.json' || srcPathString === 'service-worker.js') {
            console.error(`Error Crítico: Archivo PWA esencial ${asset.src} no encontrado. Este archivo debería existir en la raíz del proyecto.`)
        }
        else {
            console.warn(`Activo ${asset.src} no encontrado. Omitiendo.`);
        }
      }
    }
    console.log('Activos copiados con éxito.');
  } catch (err) {
    console.error('Error copiando activos:', err);
    process.exit(1);
  }
}

copyAssets();
