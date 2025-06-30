import {
  appendFieldByUniqueId,
  arrayAllExist,
  arrayAllExistDeep,
  arrayAnyExist,
  arrayAnyExistDeep,
  deepEqual,
  chunkArray,
} from './array';

describe('appendFieldByUniqueId', () => {
  const treeData = [
    {
      uniqueId: '1',
      name: 'root1',
      children: [
        {
          uniqueId: '1-1',
          name: 'child1',
          children: [],
        },
      ],
    },
    {
      uniqueId: '2',
      name: 'root2',
      children: [],
    },
  ];

  it('能找到节点并追加字段', () => {
    const newTree = appendFieldByUniqueId(JSON.parse(JSON.stringify(treeData)), '1-1', { newField: 'added' });
    const node = newTree[0].children[0];
    expect(node.newField).toBe('added');
  });

  it('不修改原树，返回新树', () => {
    const copyTree = JSON.parse(JSON.stringify(treeData));
    const result = appendFieldByUniqueId(copyTree, '2', { foo: 'bar' });
    expect(result[1].foo).toBe('bar');
  });

  it('找不到节点时不修改树', () => {
    const copyTree = JSON.parse(JSON.stringify(treeData));
    const result = appendFieldByUniqueId(copyTree, 'not-exist', { foo: 'bar' });
    expect(result).toEqual(copyTree);
  });

  it('传入非数组返回空数组', () => {
    expect(appendFieldByUniqueId(null as any, '1', { foo: 'bar' })).toEqual([]);
  });
});

describe('arrayAllExist', () => {
  it('target 全部存在 source 返回 true', () => {
    expect(arrayAllExist([1, 2, 3], [2, 3])).toBe(true);
  });

  it('target 有元素不存在 source 返回 false', () => {
    expect(arrayAllExist([1, 2, 3], [2, 4])).toBe(false);
  });

  it('空 target 返回 true', () => {
    expect(arrayAllExist([1, 2, 3], [])).toBe(true);
  });

  it('非数组参数返回 false', () => {
    expect(arrayAllExist(null as any, [1])).toBe(false);
    expect(arrayAllExist([1], null as any)).toBe(false);
  });
});

describe('arrayAllExistDeep', () => {
  it('target 全部深度存在 source 返回 true', () => {
    expect(arrayAllExistDeep([{ a: 1 }, { b: 2 }], [{ a: 1 }])).toBe(true);
  });

  it('target 有元素深度不存在 source 返回 false', () => {
    expect(arrayAllExistDeep([{ a: 1 }], [{ a: 1 }, { b: 2 }])).toBe(false);
  });

  it('空 target 返回 true', () => {
    expect(arrayAllExistDeep([{ a: 1 }], [])).toBe(true);
  });

  it('非数组参数返回 false', () => {
    expect(arrayAllExistDeep(null as any, [{ a: 1 }])).toBe(false);
  });
});

describe('arrayAnyExist', () => {
  it('target 中有任意元素存在 source 返回 true', () => {
    expect(arrayAnyExist([1, 2, 3], [4, 2])).toBe(true);
  });

  it('target 中无元素存在 source 返回 false', () => {
    expect(arrayAnyExist([1, 2, 3], [4, 5])).toBe(false);
  });

  it('空 target 返回 false', () => {
    expect(arrayAnyExist([1, 2, 3], [])).toBe(false);
  });

  it('非数组参数返回 false', () => {
    expect(arrayAnyExist([1, 2, 3], null as any)).toBe(false);
  });
});

describe('arrayAnyExistDeep', () => {
  it('target 中有任意元素深度存在 source 返回 true', () => {
    expect(arrayAnyExistDeep([{ a: 1 }], [{ b: 2 }, { a: 1 }])).toBe(true);
  });

  it('target 中无元素深度存在 source 返回 false', () => {
    expect(arrayAnyExistDeep([{ a: 1 }], [{ b: 2 }])).toBe(false);
  });

  it('空 target 返回 false', () => {
    expect(arrayAnyExistDeep([{ a: 1 }], [])).toBe(false);
  });

  it('非数组参数返回 false', () => {
    expect(arrayAnyExistDeep(null as any, [{ a: 1 }])).toBe(false);
  });
});

describe('deepEqual', () => {
  it('简单类型相等返回 true', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('abc', 'abc')).toBe(true);
  });

  it('简单类型不等返回 false', () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual('abc', 'def')).toBe(false);
  });

  it('对象深度相等返回 true', () => {
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
  });

  it('对象深度不等返回 false', () => {
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(false);
  });

  it('数组深度相等返回 true', () => {
    expect(deepEqual([1, 2, { a: 3 }], [1, 2, { a: 3 }])).toBe(true);
  });

  it('数组深度不等返回 false', () => {
    expect(deepEqual([1, 2, { a: 3 }], [1, 2, { a: 4 }])).toBe(false);
  });

  it('null 和 undefined 比较', () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
  });

  it('类型不同返回 false', () => {
    expect(deepEqual(1, '1')).toBe(false);
    expect(deepEqual({}, [])).toBe(false);
  });

  it('Date 对象比较', () => {
    expect(deepEqual(new Date(123), new Date(123))).toBe(true);
    expect(deepEqual(new Date(123), new Date(456))).toBe(false);
  });

  it('RegExp 对象比较', () => {
    expect(deepEqual(/abc/i, /abc/i)).toBe(true);
    expect(deepEqual(/abc/i, /abc/g)).toBe(false);
    expect(deepEqual(/abc/i, /def/i)).toBe(false);
  });

  it('Map 对象比较', () => {
    const map1 = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const map2 = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const map3 = new Map([
      ['a', 1],
      ['b', 3],
    ]);
    expect(deepEqual(map1, map2)).toBe(true);
    expect(deepEqual(map1, map3)).toBe(false);
  });

  it('Set 对象比较', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([3, 2, 1]);
    const set3 = new Set([1, 2]);
    expect(deepEqual(set1, set2)).toBe(true);
    expect(deepEqual(set1, set3)).toBe(false);
  });
  class MyClass {
    constructor(public x: number, public y: number) {}
  }

  it('自定义类实例比较', () => {
    const obj1 = new MyClass(1, 2);
    const obj2 = new MyClass(1, 2);
    const obj3 = new MyClass(1, 3);
    expect(deepEqual(obj1, obj2)).toBe(true);
    expect(deepEqual(obj1, obj3)).toBe(false);
    expect(deepEqual(obj1, { x: 1, y: 2 })).toBe(false); // 不同构造函数
  });
  it('复杂嵌套结构比较', () => {
    const a = {
      date: new Date(123),
      map: new Map([['key', { val: 1 }]]),
      set: new Set([1, 2]),
      nested: {
        arr: [1, 2, 3],
        regexp: /test/i,
      },
    };
    const b = {
      date: new Date(123),
      map: new Map([['key', { val: 1 }]]),
      set: new Set([2, 1]),
      nested: {
        arr: [1, 2, 3],
        regexp: /test/i,
      },
    };
    expect(deepEqual(a, b)).toBe(true);
  });
  it('NaN 比较', () => {
    expect(deepEqual(NaN, NaN)).toBe(true); // 如果你想支持这个，需要在代码里特殊判断
  });

  it('-0 和 +0 比较', () => {
    expect(deepEqual(-0, +0)).toBe(true);
  });
});

describe('chunkArray', () => {
  test('正常分块，能均匀分配', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    expect(chunkArray(arr, 3)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  test('不能均匀分配时，前面块多一个元素', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    expect(chunkArray(arr, 3)).toEqual([
      [1, 2, 3],
      [4, 5],
      [6, 7],
    ]);
  });

  test('chunkCount = 1 时返回整个数组作为一个块', () => {
    const arr = [1, 2, 3];
    expect(chunkArray(arr, 1)).toEqual([[1, 2, 3]]);
  });

  test('chunkCount 大于数组长度时，每个元素单独分块', () => {
    const arr = [1, 2, 3];
    expect(chunkArray(arr, 5)).toEqual([[1], [2], [3]]);
  });

  test('空数组返回空数组', () => {
    expect(chunkArray([], 3)).toEqual([]);
  });

  test('chunkCount 非正整数抛错', () => {
    const arr = [1, 2, 3];
    expect(() => chunkArray(arr, 0)).toThrow(RangeError);
    expect(() => chunkArray(arr, -1)).toThrow(RangeError);
    expect(() => chunkArray(arr, 1.5)).toThrow(RangeError);
  });

  test('非数组输入抛错', () => {
    expect(() => chunkArray(null as any, 2)).toThrow(TypeError);
    expect(() => chunkArray(undefined as any, 2)).toThrow(TypeError);
    expect(() => chunkArray('string' as any, 2)).toThrow(TypeError);
  });
});
