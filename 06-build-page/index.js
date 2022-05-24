/*
Один из возможных порядков выполнения задачи:

Импорт всех требуемых модулей
Прочтение и сохранение в переменной файла-шаблона
Нахождение всех имён тегов в файле шаблона
Замена шаблонных тегов содержимым файлов-компонентов
Запись изменённого шаблона в файл index.html в папке project-dist
Использовать скрипт написанный в задании 05-merge-styles для создания файла style.css
Использовать скрипт из задания 04-copy-directory 
для переноса папки assets в папку project-dist*/
const path = require('path');
const fs = require('fs');
const fsProm = require('fs/promises');

let readSrteam = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
let template = '';



new Promise((resolve, reject) => {
  readSrteam.on('data', chunk => template += chunk);
  readSrteam.on('error', () => reject());
  readSrteam.on('end', () => resolve(template));
})
  .then(()=> fsProm.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}))
  .then( () => {
    return new Promise((resolve) => {
      resolve( Array.from(template.matchAll(/{{(\w+)}}/g)).map(item => item[1]));
    });
  })
  .then((componentNames) => {
    return Promise.all(componentNames.map((compName)=> {
      let innerComponent = '';
      let readSrteam = fs.createReadStream(path.join(__dirname, 'components', `${compName}.html` ), 'utf-8');
      
      return new Promise((resolve, reject) => {
        readSrteam.on('data', chunk => innerComponent += chunk);
        readSrteam.on('error', () => reject());
        readSrteam.on('end', () => resolve({[`${compName}`]: innerComponent}));
      });
    }));
  })
  .then((compArr)=> {
    return new Promise((resolve) => {
      for(let key in compArr) {
        let objKey = Object.keys(compArr[key])[0];
        let regexp = new RegExp(`{{${objKey}}}`, 'g');  
        template = template.replace(regexp, compArr[key][objKey]);
      }
      resolve(template);
    });    
  })
  
  .then(()=>{
    return new Promise((resolve)=>{
      const distHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
      distHtml.write(template);
      resolve();
    });
  })
  .then(()=>{
    const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

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

    fsProm.readdir(path.join(__dirname,'project-dist', 'assets'), {withFileTypes: true})
      .then((files) => {
        return Promise.all(files.map((file) => {
          return fsProm.rm(path.join(__dirname, 'project-dist', 'assets', file.name), {force: true});
        }));
      })
      .then(() => fsProm.readdir(path.join(__dirname, 'assets'), {withFileTypes: true}))
      .then((files) => {
        return Promise.all(files.map((file) => {
          return fsProm.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name));
        }));
      })
      .then(() => {
        console.log('Copying completed');
      });
  });
