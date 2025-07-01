/**
 * @interface IStorageAdapter
 * @description 存储适配器接口，定义统一的存储操作方法，支持泛型。
 */
export interface IStorageAdapter {
  /**
   * 设置指定键的值
   * @template T - 存储值的类型
   * @param {string} key - 存储的键，不能为空字符串
   * @param {T} value - 要存储的值，支持任意类型，非字符串会自动序列化为 JSON
   * @param {*} [options] - 可选参数，具体实现类定义具体类型
   */
  set<T>(key: string, value: T, options?: any): void;

  /**
   * 获取指定键的值
   * @template T - 返回值类型，默认为 any
   * @param {string} key - 存储的键，不能为空字符串
   * @returns {(T | null)} 返回对应类型的值，找不到返回 null
   */
  get<T = any>(key: string): T | null;

  /**
   * 删除指定键的存储项
   * @param {string} key - 要删除的键，不能为空字符串
   * @param {*} [options] - 可选参数，具体实现类定义具体类型
   */
  remove(key: string, options?: any): void;

  /**
   * 清空所有存储项
   */
  clear(): void;
}
