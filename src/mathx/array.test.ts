import {
  appendFieldByUniqueId,
  arrayAllExist,
  arrayAllExistDeep,
  arrayAnyExist,
  arrayAnyExistDeep,
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
