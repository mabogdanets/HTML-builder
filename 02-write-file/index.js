const path = require('path');
const fs = require('fs');
const { stdin, stdout } = require('process');
const readline = require('readline');

const rl = readline.createInterface({ 
  input: stdin, 
  output: stdout 
});

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

stdout.write('Введите что-нибудь: \n');

rl.on('line', (input) => {
  if(input === 'exit') {
    stdout.write('Досвидания!'),
    rl.close();
  } else {
    writeStream.write(`${input}\n`);
  }
});

rl.on('SIGINT', () =>{
  stdout.write('Досвидания!'),
  rl.close();
});
