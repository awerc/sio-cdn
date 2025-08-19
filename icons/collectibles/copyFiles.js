const fs = require('fs/promises');
const path = require('path');
const process = require('process');

async function copyNumberedFiles(sourceDir) {
  try {
    // Проверяем существование исходной директории
    const stats = await fs.stat(sourceDir);
    if (!stats.isDirectory()) {
      throw new Error(`Указанный путь не является директорией: ${sourceDir}`);
    }

    // Читаем содержимое директории
    const files = await fs.readdir(sourceDir);

    // Фильтруем файлы по шаблону: число + '_' в начале имени
    const pattern = /^\d+_.+/;
    const matchedFiles = files.filter(file => pattern.test(file) && !file.includes('SCPsuipian'));

    // Копируем каждый подходящий файл
    for (const file of matchedFiles) {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(process.cwd(), file);

      try {
        await fs.copyFile(sourcePath, destPath);
        console.log(`Скопировано: ${file}`);
      } catch (copyError) {
        console.error(`Ошибка при копировании ${file}:`, copyError.message);
      }
    }

    console.log(`\nГотово! Скопировано файлов: ${matchedFiles.length}`);
  } catch (error) {
    console.error('Ошибка:', error.message);
    process.exit(1);
  }
}

// Проверка аргументов командной строки
if (process.argv.length !== 3) {
  console.log('Использование: node copyFiles.js <исходная_директория>');
  console.log('Пример: node copyFiles.js ../data/files');
  process.exit(1);
}

const sourceDirectory = process.argv[2];
copyNumberedFiles(sourceDirectory);
