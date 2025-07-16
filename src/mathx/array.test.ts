import {
  appendFieldByUniqueId,
  arrayAllExist,
  arrayAllExistDeep,
  arrayAnyExist,
  arrayAnyExistDeep,
  chunkArray,
  extractPropertyToArray,
  arrayToObject,
  toMappedArray,
  findValueByKey,
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

describe('toMappedArray', () => {
  it('should map items correctly with default options', () => {
    const items = [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' },
    ];
    const result = toMappedArray(items);
    expect(result).toEqual([{ value: '1' }, { value: '2' }]);
  });

  it('should map items correctly with custom key and value fields', () => {
    const items = [
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
    ];
    const result = toMappedArray(items, {
      inKeyField: 'id',
      inValueField: 'name',
      outKeyField: 'key',
      outValueField: 'label',
    });
    expect(result).toEqual([
      { key: '1', label: 'One' },
      { key: '2', label: 'Two' },
    ]);
  });

  it('should return an empty array when input is null or undefined', () => {
    expect(toMappedArray(null)).toEqual([]);
    expect(toMappedArray(undefined)).toEqual([]);
  });

  it('should return items when includeKey or includeValue is false', () => {
    const items = [
      { value: '1', label: 'One' },
      { value: '2', label: 'Two' },
    ];
    const result = toMappedArray(items, { includeKey: false });
    expect(result).toEqual([{ value: '1' }, { value: '2' }]);
  });
});

describe('Utility Functions', () => {
  describe('extractPropertyToArray', () => {
    it('should extract specified property values from an array of objects', () => {
      const items = [{ key: 'key1' }, { key: 'key2' }, { key: undefined }];
      const keys = extractPropertyToArray(items, 'key');
      expect(keys).toEqual(['key1', 'key2']);
    });

    it('should exclude null and undefined values when specified', () => {
      const items = [{ key: 'key1' }, { key: null }, { key: undefined }];
      const keys = extractPropertyToArray(items, 'key', true);
      expect(keys).toEqual(['key1']);
    });
  });

  describe('arrayToObject', () => {
    it('should convert an array of strings into an array of objects', () => {
      const stringArray = ['item1', 'item2', null];
      const objects = arrayToObject(stringArray);
      expect(objects).toEqual([{ key: 'item1' }, { key: 'item2' }, { key: null }]);
    });

    it('should return an empty array for null input', () => {
      const objects = arrayToObject(null);
      expect(objects).toEqual([]);
    });

    it('should exclude null values when specified', () => {
      const stringArray = ['item1', 'item2', null];
      const objects = arrayToObject(stringArray, 'key', true);
      expect(objects).toEqual([{ key: 'item1' }, { key: 'item2' }]);
    });
  });
});

describe('findValueByKey', () => {
  const items = [
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
    { id: '3', name: 'Three' },
  ];

  test('should return the whole object when returnKey is not provided', () => {
    const result = findValueByKey(items, 'id', '1');
    expect(result).toEqual({ id: '1', name: 'One' });
  });

  test('should return the specified key value when returnKey is provided', () => {
    const result = findValueByKey(items, 'id', '1', 'name');
    expect(result).toBe('One');
  });

  test('should return null if no matching item is found', () => {
    const result = findValueByKey(items, 'id', '4');
    expect(result).toBeNull();
  });

  test('should return null if items is null', () => {
    const result = findValueByKey(null, 'id', '1');
    expect(result).toBeNull();
  });

  test('should return null if items is undefined', () => {
    const result = findValueByKey(undefined, 'id', '1');
    expect(result).toBeNull();
  });

  test('should return the specified key value for different keys', () => {
    const result = findValueByKey(items, 'id', '2', 'name');
    expect(result).toBe('Two');
  });

  test('should return the whole object when returnKey is null', () => {
    const result = findValueByKey(items, 'id', '1', null);
    expect(result).toEqual({ id: '1', name: 'One' });
  });

  test('should return the whole object when returnKey is undefined', () => {
    const result = findValueByKey(items, 'id', '1', undefined);
    expect(result).toEqual({ id: '1', name: 'One' });
  });
});
