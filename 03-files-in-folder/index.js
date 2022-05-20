//формате <имя файла>-<расширение файла>-<вес файла>.
// Пример: example - txt - 128.369kb
const path = require('path');
const fs = require('fs');
//const { readdir } = require('fs/promises');
//const { stdin, stdout } = require('process');

const dirPath = path.join(__dirname, 'secret-folder');

/*readdir(dirPath, {withFileTypes: true}, (error, data) => {
  if (error) console.error(error);
  data.forEach(file => {
    console.log(file);
    if (file.isFile()) {
      console.log(path.extname(__dirname, 'styles', file.name));        
    }
  });
});//__dirname*/


fs.readdir(dirPath, {withFileTypes: true}, (error, data) => {
  if (error) console.error(error.message);
  data.forEach(file => {
    if (file.isFile()) {
      fs.stat(path.join(dirPath, file.name), (error, stats) => {
        if (error) console.error(error);
        console.log(`${path.parse(file.name).name} - ${path.extname(file.name).slice(1)} - ${stats.size/1024}kb`);      
      });
    }
  });  
});