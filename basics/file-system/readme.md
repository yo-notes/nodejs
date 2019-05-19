# File System

文件 I/O，一般有同步/异步成对方法。

```js
const fs = require('fs');
```

## 内置常量

```js
fs.constants

// f.access
f.constants.F_OK // 可见
f.constants.R_OK // 可读
f.constants.W_OK // 可写
f.constants.X_OK // 可执行

// 
```
 
### fs.access / fs.accessSync

```js
// 检测对当前的调用 process 是否具有对应的访问权限，如果没有对应权限，则 err 会被赋值
fs.access('/etc/passwd', fs.constants.R_OK | fs.constants.W_OK, (err) => {
  console.log(err ? 'no access!' : 'can read/write');
});

// 同步方法
try {
  fs.accessSync('etc/passwd', fs.constants.R_OK | fs.constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```

## fs.appendFile / fs.append

给文件追加数据。

```js
// fs.appendFile(file, data[, options], callback)
fs.appendFile('demo.file', 'this is apend data', 'utf8', (err) => {
  if(err) throw err;
  console.log('append data to "demo.file" done.');
});

// fs.appendFileSync(file, data[, options])
```

## fs.close / fs.closeSync / fs.open /fs.openSync

```js
const fd = fs.openSync('demo.file');

fs.closeSync(fd);
```

## fs.chmod / fs.chmodSync

修改文件权限。

## fs.chown / fs.chmodSync

修改文件权限。

## fs.copyFile / fs.copyFileSync

文件复制。

```js
// fs.copyFile(src, dest[, flags], callback)
fs.copyFile('demo.file', 'demo-copy.file', fs.constants.COPYFILE_EXCL, (err) => {
  if (err) throw err;
  console.log('demo.file was copied to demo-copy.file');
});
// fs.copyFileSync(src, dest[, flags])
```

## 

```js
fs.watch('./readme.md', (eventType, filename) => {
  if(filename) {
    console.log(filename);
  }
})
```

## fs.createReadStream / fs.createReadStreamSync

```js
fs.createReadStream()
```