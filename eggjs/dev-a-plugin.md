# 开发一个 helper 插件

```js
'use strict';

const safeAccess = (obj, path, def) => {
  // 确保 path 中的括弧匹配，isBracketMatch 实现细节可以访问这里: 
  // if (!isBracketMatch(path)) {
  //   throw new Error(
  //     `brackets in access path "${path}" are not matched.`
  //   );
  // }

  const propNames = path.replace(/\]|\)/, '').split(/\.|\[|\(/);

  try {
    return propNames.reduce((acc, prop) => acc[prop] || def, obj);
  } catch (e) {
    return def;
  }
};

module.exports = safeAccess;

```

编写测试用例

更多关于编写测试用例的笔记可以点击[这里](./write-test.md)

```js
beforeEach(() => {
  const ctx = app.mockContext();
  helper = ctx.helper;
});

it('should load/run safeAccess', () => {
  const _get = helper.safeAccess;
  const obj = {
    items: [{ hello: 'Hello' }],
  };
  
  assert.throws(() => _get(obj, 'items[[0].hello', 'default'));
  assert(_get(obj, 'items[0].hello', 'default') === 'Hello');
  assert(_get(obj, 'items[1].hello', 'default') === 'default');
  assert(_get(undefined, 'items[0].hello') === undefined);
});
```