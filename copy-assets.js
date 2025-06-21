
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
    src: path.join(__dirname, 'pepi.png'), 
    dest: path.join(__dirname, 'dist', 'pepi.png')
  },
  { 
    src: path.join(__dirname, 'gemini.png'), // Nuevo avatar genérico
    dest: path.join(__dirname, 'dist', 'gemini.png') 
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
    src: path.join(__dirname, 'icons'), 
    dest: path.join(__dirname, 'dist', 'icons')
  }
];

async function copyAssets() {
  try {
    await fs.ensureDir(path.join(__dirname, 'dist'));

    for (const asset of assetsToCopy) {
      if (await fs.pathExists(asset.src)) {
        await fs.copy(asset.src, asset.dest, { overwrite: true }); 
        console.log(`Copiado ${asset.src} a ${asset.dest}`);
      } else {
        const srcPathString = asset.src.split(path.sep).pop(); 

        if (srcPathString === 'icons') { 
             console.warn(`Directorio de iconos PWA (${asset.src}) no encontrado. Por favor, créalo y añade los archivos de icono como se especifica en manifest.json. La aplicación funcionará, pero los iconos PWA podrían faltar. Omitiendo.`);
        } else if (srcPathString === 'pepi.png') { 
             console.warn(`Activo ${asset.src} no encontrado. Omitiendo. (Nota: pepi.png es para la asistente Pepi. Asegúrate de que el archivo existe en la raíz del proyecto).`);
        } else if (srcPathString === 'gemini.png') { 
             console.warn(`Activo ${asset.src} no encontrado. Omitiendo. (Nota: gemini.png es el avatar genérico. Asegúrate de que el archivo existe en la raíz del proyecto).`);
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