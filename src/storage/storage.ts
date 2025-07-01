import { IStorageAdapter } from './adapter';
import { StorageOptions, StorageType } from './typed';

/**
 * @class StorageWrapper
 * @implements {IStorageAdapter}
 * @description 封装 localStorage 和 sessionStorage 操作，自动序列化/反序列化，统一接口
 */
export class StorageWrapper implements IStorageAdapter {
  /** 浏览器存储对象，localStorage 或 sessionStorage */
  private storage: Storage;

  /**
   * 构造函数，初始化存储类型
   * @param {StorageType} [type=StorageType.Local] - 选择 localStorage 或 sessionStorage，默认 localStorage
   */
  constructor(type: StorageType = StorageType.Local) {
    this.storage = type === StorageType.Session ? window.sessionStorage : window.localStorage;
  }

  /**
   * 设置存储项
   * @template T
   * @param {string} key - 存储键，不能为空字符串
   * @param {T} value - 要存储的值，非字符串自动序列化为 JSON
   * @param {StorageOptions} [options] - 预留参数，当前无实际使用
   * @returns {void}
   */
  set<T>(key: string, value: T, options?: StorageOptions): void {
    if (!key.trim()) return;

    try {
      if (value === undefined || typeof value === 'function') {
        console.warn(`${this.storageType} set 警告：value 是 undefined 或函数类型，忽略存储`);
        return;
      }

      const val = typeof value === 'string' ? value : JSON.stringify(value);
      this.storage.setItem(key, val);
    } catch (error) {
      console.error(`${this.storageType} set 出错:`, error);
    }
  }

  /**
   * 获取存储项
   * @template T
   * @param {string} key - 存储键，不能为空字符串
   * @returns {(T | null)} 返回对应类型的值，找不到返回 null
   */
  get<T = any>(key: string): T | null {
    if (!key.trim()) return null;

    try {
      const val = this.storage.getItem(key);
      if (val === null) return null;

      try {
        return JSON.parse(val) as T;
      } catch {
        // 非 JSON 字符串，直接返回字符串
        return val as unknown as T;
      }
    } catch (error) {
      console.error(`${this.storageType} get 出错:`, error);
      return null;
    }
  }

  /**
   * 删除存储项
   * @param {string} key - 存储键，不能为空字符串
   * @param {StorageOptions} [options] - 预留参数，当前无实际使用
   * @returns {void}
   */
  remove(key: string, options?: StorageOptions): void {
    if (!key.trim()) return;
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`${this.storageType} remove 出错:`, error);
    }
  }

  /**
   * 清空所有存储项
   * @returns {void}
   */
  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error(`${this.storageType} clear 出错:`, error);
    }
  }

  /**
   * 获取当前存储类型字符串，便于日志输出
   * @private
   * @returns {string}
   */
  private get storageType(): string {
    return this.storage === window.localStorage ? StorageType.Local : StorageType.Session;
  }
}
