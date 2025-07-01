import { IStorageAdapter } from './adapter';
import { CookieOptions } from './typed';

/**
 * @class CookieWrapper
 * @implements {IStorageAdapter}
 * @description 封装浏览器 Cookie 操作，支持序列化/反序列化及过期时间、路径、域名、secure 标志
 */
export class CookieWrapper implements IStorageAdapter {
  /**
   * 设置 Cookie
   * @template T
   * @param {string} key - Cookie 键，不能为空字符串
   * @param {T} value - 要存储的值，非字符串自动序列化为 JSON
   * @param {CookieOptions} [options] - 可选参数，支持 expires、path、domain、secure
   * @returns {void}
   */
  set<T>(key: string, value: T, options?: CookieOptions): void {
    if (!key || !key.trim()) return;

    try {
      const val = typeof value === 'string' ? value : JSON.stringify(value);
      let cookieStr = encodeURIComponent(key) + '=' + encodeURIComponent(val);

      if (options) {
        if (options.expires !== undefined) {
          const expiresDate = new Date();
          expiresDate.setTime(expiresDate.getTime() + options.expires * 24 * 60 * 60 * 1000);
          cookieStr += `; expires=${expiresDate.toUTCString()}`;
        }
        cookieStr += `; path=${options.path ?? '/'}`;
        if (options.domain) {
          cookieStr += `; domain=${options.domain}`;
        }
        if (options.secure) {
          cookieStr += '; secure';
        }
      } else {
        cookieStr += '; path=/';
      }

      document.cookie = cookieStr;
    } catch (error) {
      console.error('Cookie set 出错:', error);
    }
  }

  /**
   * 获取 Cookie
   * @template T
   * @param {string} key - Cookie 键，不能为空字符串
   * @returns {(T | null)} 返回对应类型的值，找不到返回 null
   */
  get<T = any>(key: string): T | null {
    if (!key || !key.trim()) return null;

    try {
      const nameEQ = encodeURIComponent(key) + '=';
      const cookies = document.cookie.split(';');
      for (let c of cookies) {
        c = c.trim();
        if (c.indexOf(nameEQ) === 0) {
          const val = decodeURIComponent(c.substring(nameEQ.length));
          try {
            return JSON.parse(val) as T;
          } catch {
            return val as unknown as T;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Cookie get 出错:', error);
      return null;
    }
  }

  /**
   * 删除 Cookie（通过设置过期时间为过去时间）
   * @param {string} key - Cookie 键，不能为空字符串
   * @param {Pick<CookieOptions, 'path' | 'domain'>} [options] - 可选参数，指定 path 和 domain
   * @returns {void}
   */
  remove(key: string, options?: Pick<CookieOptions, 'path' | 'domain'>): void {
    if (!key || !key.trim()) return;

    try {
      this.set(key, '', {
        expires: -1, // 立即过期
        path: options?.path ?? '/',
        domain: options?.domain,
      });
    } catch (error) {
      console.error('Cookie remove 出错:', error);
    }
  }

  /**
   * 清空所有 Cookie（注意：只能清除当前路径和域下的 Cookie）
   * @returns {void}
   */
  clear(): void {
    try {
      const cookies = document.cookie.split(';');
      for (let c of cookies) {
        const eqPos = c.indexOf('=');
        const key = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        this.remove(decodeURIComponent(key));
      }
    } catch (error) {
      console.error('Cookie clear 出错:', error);
    }
  }
}
