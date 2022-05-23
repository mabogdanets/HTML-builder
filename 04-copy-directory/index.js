const path = require('path');
const fsProm = require('fs/promises');

fsProm.mkdir(path.join(__dirname, 'files-copy'), {recursive: true})
  .then(() => fsProm.readdir(path.join(__dirname, 'files-copy'), {withFileTypes: true}))
  .then((files) => {
    return Promise.all(files.map((file) => {
      return fsProm.rm(path.join(__dirname, 'files-copy', file.name), {force: true});
    }));
  })
  .then(() => fsProm.readdir(path.join(__dirname, 'files'), {withFileTypes: true}))
  .then((files) => {
    return Promise.all(files.map((file) => {
      return fsProm.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name));
    }));
  })
  .then(() => {
    console.log('Copying completed');
  });