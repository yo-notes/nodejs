# Modules

在 Node.js 中，每一个文件都被当作一个独立的模块，模块之间通过 `require` 来导入（引用）。

```js
// foo.js
const circle = require('./circle.js');
console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);

// circle.js
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```

可以看到一般就这么两种引用方式：

```js
// 解构导入
const { aa, aaa } = require('a');

const a = require('a');
a.aa;
a.aaa;

// a
exports.aa = 'aa';
exports.aaa = 'aaa';
// 或者

module.exports = {
  aa: 'aa',
  aaa: 'aaa'
}
```

注意：`module.exports.x = xxx` 可以简写为 `exports.x = xxx`，但 `module.exports = xxx` 不能简写成 `exports = xxx`，因为后者相当于把原来的 `exports = module.exports` 重置了，可以通过 `exports = module.exports = {...}` 再重置回来。

给 `module.exports` 赋值必须是即时的，不能在（异步）回调里进行。

## 加载顺序

如果是一个核心模块（即模块名字不是以 `/`、`./` 或 `../` 开头），直接去当前目录的 node_modules 查找，然后是上一层目录的 node_modules，直到根目录，找不到报错。

非核心模块先解析出真实路径，然后依据先尝试加载文件（`无后缀`/`.js`/`.json`/`.node`），然后尝试目录（`index.js`/`index.json`/`index.node`），找不到则报错。

注意：导入目录这里如果目录下存在 `package.json` ，则会根据其中 `main` 字段指定的路径（或文件）来继续进行文件/目录加载。

## 缓存

加载后的模块会被缓存起来，所以多次加载并不会导致模块被多次执行。

## 循环

`a.js`：

```js
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```

`b.js`：

```js
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```

`main.js`：

```js
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```

当 `main.js` 加载 `a.js` 然后 `a.js` 又加载 `b.js` 然后 `b.js` 又加载 `a.js` 时，发生了循环依赖，为了防止无限循环，`a.js` 的导出对象的一个「未完成拷贝」返回给 `b.js`，从而让 `b.js` 完成加载，然后它的 `exports` 对象提供给了 `a.js`。

`node main.js` 输出：

```shell
main starting
a starting
b starting
in b, a.done = undefined
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```

在一个模块代码被执行前，Node.js 会给它包裹一个函数：

```js
(function(exports, require, module, __filename, __dirname) {
// Module code actually lives in here
});
```

这样的话首先保证了模块内的变量不会暴露到全局，同时模块内可以使用一些变量（函数入参）。具体 API 参考官网 [The module scope](https://nodejs.org/docs/latest-v8.x/api/modules.html#modules_the_module_scope)。