#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PUBLIC_DIR = path.join(__dirname, '../public');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];
const WEBP_QUALITY = 75;
const AVIF_QUALITY = 50;

// Vérifier si cwebp est installé
function checkCwebp() {
  try {
    execSync('cwebp -version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.log('❌ cwebp n\'est pas installé. Installation nécessaire :');
    console.log('  Ubuntu/Debian: sudo apt-get install webp');
    console.log('  macOS: brew install webp');
    console.log('  Windows: Télécharger depuis https://developers.google.com/speed/webp');
    return false;
  }
}

// Vérifier si avifenc est installé (optionnel)
function checkAvifenc() {
  try {
    execSync('avifenc --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.log('⚠️  avifenc n\'est pas installé. Seul WebP sera généré.');
    return false;
  }
}

// Convertir une image en WebP
function convertToWebp(inputPath, outputPath) {
  try {
    execSync(`cwebp -q ${WEBP_QUALITY} "${inputPath}" -o "${outputPath}"`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error(`❌ Erreur conversion WebP pour ${inputPath}:`, error.message);
    return false;
  }
}

// Convertir une image en AVIF
function convertToAvif(inputPath, outputPath) {
  try {
    execSync(`avifenc --min-q ${AVIF_QUALITY} --max-q ${AVIF_QUALITY} "${inputPath}" "${outputPath}"`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error(`❌ Erreur conversion AVIF pour ${inputPath}:`, error.message);
    return false;
  }
}

// Obtenir tous les fichiers images
function getAllImages(dir) {
  const images = [];
  
  function scanDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Ignorer les dossiers système et les fichiers de template
        if (!file.startsWith('.') && file !== 'Modèle de page de destination vendredi noir _ PSD Gratuite_files') {
          scanDirectory(filePath);
        }
      } else {
        const ext = path.extname(file).toLowerCase();
        if (SUPPORTED_FORMATS.includes(ext)) {
          images.push(filePath);
        }
      }
    }
  }
  
  scanDirectory(dir);
  return images;
}

// Fonction principale
function main() {
  console.log('🚀 Optimisation des images pour Flocon...\n');
  
  // Vérifier les outils
  const hasCwebp = checkCwebp();
  const hasAvifenc = checkAvifenc();
  
  if (!hasCwebp) {
    process.exit(1);
  }
  
  // Obtenir toutes les images
  const images = getAllImages(PUBLIC_DIR);
  console.log(`📁 ${images.length} images trouvées dans ${PUBLIC_DIR}\n`);
  
  let webpCount = 0;
  let avifCount = 0;
  let errorCount = 0;
  
  // Traiter chaque image
  for (const imagePath of images) {
    const dir = path.dirname(imagePath);
    const name = path.basename(imagePath, path.extname(imagePath));
    
    // Générer WebP
    const webpPath = path.join(dir, `${name}.webp`);
    if (!fs.existsSync(webpPath)) {
      if (convertToWebp(imagePath, webpPath)) {
        webpCount++;
        console.log(`✅ WebP créé: ${path.relative(PUBLIC_DIR, webpPath)}`);
      } else {
        errorCount++;
      }
    } else {
      console.log(`⏭️  WebP existe déjà: ${path.relative(PUBLIC_DIR, webpPath)}`);
    }
    
    // Générer AVIF (si disponible)
    if (hasAvifenc) {
      const avifPath = path.join(dir, `${name}.avif`);
      if (!fs.existsSync(avifPath)) {
        if (convertToAvif(imagePath, avifPath)) {
          avifCount++;
          console.log(`✅ AVIF créé: ${path.relative(PUBLIC_DIR, avifPath)}`);
        } else {
          errorCount++;
        }
      } else {
        console.log(`⏭️  AVIF existe déjà: ${path.relative(PUBLIC_DIR, avifPath)}`);
      }
    }
  }
  
  // Résumé
  console.log('\n📊 Résumé de l\'optimisation:');
  console.log(`  • ${webpCount} nouvelles images WebP créées`);
  console.log(`  • ${avifCount} nouvelles images AVIF créées`);
  console.log(`  • ${errorCount} erreurs`);
  
  if (webpCount > 0 || avifCount > 0) {
    console.log('\n🎉 Optimisation terminée! Les images modernes sont prêtes.');
    console.log('💡 Pensez à mettre à jour vos composants pour utiliser les nouveaux formats.');
  } else {
    console.log('\n✅ Toutes les images sont déjà optimisées.');
  }
}

// Exécuter
if (require.main === module) {
  main();
}

module.exports = { getAllImages, convertToWebp, convertToAvif };
