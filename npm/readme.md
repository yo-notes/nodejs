# npm 如何工作

## package 是什么

> **tl;dr**
> * package 是一个由 `package.json` 定义的文件或目录
> * module 是任何可以由 Node.js 的 `requrie()` 加载的文件或目录

## package is

* a) a folder containing a program described by a `package.json` file
* b) a gzipped tarball containing (a)
* c) a url that resolves to (b)
* d) a `<name>@<version>` that is published on the registry with (c)
* e) a `<name>@<tag>` that points to (d)
* f) a `<name>` that has a latest tag satisfying (e)
* g) a git url that, when cloned, results in (a).

### module is

* A folder with a `package.json` file containing a `main` field.
* A folder with an `index.js` file in it.
* A JavaScript file.

node_modules 目录是 Node.js 查找模块的地方，即使 `node_modules/foo.js` 也可以通过 `cont f = require('foo.js')` 来加载，虽然 `foo.js` 不是一个 package。


## 依赖地狱

假设由这么一种依赖场景：

App --> A:v1.0, B:v1.0

A   --> C:v2.0

B   --> C:v1.0


那么最终 App 依赖的 C 版本是多少呢？


在 npm 2 中，会是这种结果：

```bash
App
  node_modules:
    A:v1.0
      node_modules:
        C:v2.0
    B:v1.0
      node_modules:
        C:v1.0
```

所有同样的模块都会在各自的父模块里，即完全保持与 package.json 的依赖关系树一致。

在 npm 3 中，会是这种结果：

```bash
App
  node_modules:
    A:v1.0
    C:v2.0
    B:v1.0
      node_modules:
        C: v1.0
```

模块 C 被提升到了 App 的 node_modules 里，这种提升是按照安装依赖顺序来的，即如果先安装了 B 的话，那么 C:v1.0 会被提升到 App 的 node_modules 里，此时如果安装了模块 D，它依赖了 C:v1.0，那么会在 D 的 node_modules 里安装 C:v1.0，即如果某个模块已经在 top level（App 的 node_modules 下），那么该模块的其它版本只能在引入该模板的模块 node_modules 下，而如果此时安装了模块 E，它依赖 C:v2.0，则会共用 top level C。

最后强调一下，依赖树是根据安装顺序来的，即如果直接根据 `package.json` 来 `npm install`，会按照 package.json 里的依赖顺序来生成，如果是通过 `npm install xx`，则会根据该命令来生成，如上面的例子，如果先安装了模块 B，那么 C:v1.0 会成为 top level 的依赖。

----

## 参考

1. [how-npm-works-docs](https://npm.github.io/how-npm-works-docs)
