//прочитать папку стайлс
//пройтись по файлам, отфильтровать с .css
//создать файл boundle
//скопировать туда содержимое
/*
Импорт всех требуемых модулей
Чтение содержимого папки styles
Проверка является ли объект файлом и имеет ли файл нужное расширение
Чтение файла стилей
Запись прочитанных данных в массив
Запись массива стилей в файл bundle.css
*/
const path = require('path');
const fs = require('fs');
const fsProm = require('fs/promises');

const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(bundlePath);


fsProm.readdir(path.join(__dirname, 'styles'),{withFileTypes: true})
  .then((files) => {
    files.forEach(file => {
      if( checkFile(file) ){
        let readSrteam = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
        return new Promise((resolve, reject) => {
          readSrteam.on('data', chunk => output.write(chunk));
          readSrteam.on('error', () => reject());
          readSrteam.on('end', () => resolve());
        });
      }
    });
  });

function checkFile(file) {
  return (file.isFile() && path.extname(file.name) === '.css') ? true : false; 
}