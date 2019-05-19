const fs = require('fs');

const watchHanler = fs.watch('./readme.md', (eventType, filename) => {
  if (filename) {
    console.log(filename);
  }
});

console.log(fs.stat)

setTimeout(() => {
  watchHanler.close();
  console.log('file watch closed.')
}, 5000);

// append data
fs.appendFile('demo.file', 'this is apend data', (err) => {
  if(err) throw err;
  console.log('append data to "demo.file" done.');
});

// file copy
fs.copyFile('demo.file', 'demo-copy.file', fs.constants.COPYFILE_EXCL, (err) => {
  if (err) throw err;
  console.log('demo.file was copied to demo-copy.file');
});

//
