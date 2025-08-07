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
  swapArrayIndex,
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

describe('swapArrayIndex', () => {
  // 测试正常的元素交换
  test('should swap two elements in an array', () => {
    const arr = [1, 2, 3];
    swapArrayIndex(arr, 0, 2);
    expect(arr).toEqual([3, 2, 1]); // 期望结果
  });

  // 测试字符串元素的交换
  test('should swap two string elements in an array', () => {
    const arr2 = ['a', 'b', 'c'];
    swapArrayIndex(arr2, 1, 2);
    expect(arr2).toEqual(['a', 'c', 'b']); // 期望结果
  });

  // 测试布尔值元素的交换
  test('should swap two boolean elements in an array', () => {
    const arr3 = [true, false];
    swapArrayIndex(arr3, 0, 1);
    expect(arr3).toEqual([false, true]); // 期望结果
  });

  // 测试相同索引的情况，数组不应改变
  test('should not change the array if the indices are the same', () => {
    const arr4 = [1, 2, 3];
    swapArrayIndex(arr4, 1, 1);
    expect(arr4).toEqual([1, 2, 3]); // 期望结果
  });

  // 测试索引超出范围的情况，数组应保持不变
  test('should not swap if indices are out of bounds', () => {
    const arr5 = [1, 2, 3];
    const originalArray = [...arr5]; // 复制原始数组
    swapArrayIndex(arr5, -1, 3); // 无效索引
    expect(arr5).toEqual(originalArray); // 应保持不变
  });

  // 测试空数组的情况
  test('should handle empty arrays', () => {
    const arr6: number[] = [];
    swapArrayIndex(arr6, 0, 0); // 对空数组无效
    expect(arr6).toEqual([]); // 期望结果
  });

  // 测试只有一个元素的数组
  test('should handle arrays with one element', () => {
    const arr7 = [42];
    swapArrayIndex(arr7, 0, 0); // 对单元素数组无效
    expect(arr7).toEqual([42]); // 期望结果
  });
});
